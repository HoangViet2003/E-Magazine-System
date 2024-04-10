const {
	Submission,
	Contribution,
	Faculty,
	User,
	Notification,
	Article,
	Comment,
} = require("../models")

const PuppeteerHTMLPDF = require("puppeteer-html-pdf")

const path = require("path")
const fs = require("fs")
const JSZip = require("jszip")
const https = require("https")

const ejs = require("ejs")
const { handleSendEmail } = require("../utils/sendMail")
const { emitNotification } = require("../utils/initSocket")

const getSubmissionById = async (req, res) => {
	try {
		const { submissionId } = req.params

		const submission = await Submission.findById(submissionId)

		if (!submission) {
			return res.status(404).json({ error: "Submission does not exist" })
		}

		return res.status(200).json({ submission })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const getUnselectedArticlesOfStudentsBySubmissionId = async (req, res) => {
	try {
		const { submissionId } = req.params

		const submission = await Submission.findById(submissionId)

		if (!submission) {
			return res.status(404).json({ message: "Submission not found" })
		}

		// Check if the submission belongs to the student
		if (submission.student._id.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ message: "You are not authorized to perform this action" })
		}

		const articles = await Article.find({
			student: submission.student,
			_id: { $nin: submission.articles },
		}).select("_id title type updatedAt")

		return res.status(200).json({ articles })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const createSubmission = async (req, res) => {
	try {
		// Get the current year
		const currentYear = new Date().getFullYear()

		// Check if the clsoure date has passed
		// Get the contribution with the given ID
		const contribution = await Contribution.findOne({
			academicYear: currentYear,
			facultyId: req.user.facultyId,
		})

		if (!contribution) {
			return res.status(404).json({ message: "Contribution not found" })
		}

		// Check if the student has already created submission for this contribution
		const existingSubmission = await Submission.findOne({
			student: req.user._id,
			contributionId: contribution._id,
		})

		if (existingSubmission) {
			return res.status(400).json({
				message: "You have already submitted for this contribution",
			})
		}

		// Check if the closure date has passed
		const currentDate = new Date()
		if (currentDate > contribution.closureDate) {
			return res.status(400).json({
				message: "The closure date has passed",
			})
		}

		// Create a new submission
		const newSubmission = await Submission.create({
			student: req.user._id,
			contributionId: contribution._id,
		})

		// send email to the student
		const studentEmailHtml = await ejs.renderFile(
			"./src/emails/submission/student.received.email.ejs"
		)
		await handleSendEmail({
			to: req.user.email,
			subject: "Submission Received",
			html: studentEmailHtml,
		})

		// Find the marketing coordinator of the faculty
		const faculty = await Faculty.findById(req.user.facultyId)
		const marketingCoordinator = await User.findById(
			faculty.marketingCoordinatorId
		)

		// send email to the marketing coordinator
		const marketingCoordinatorEmailHtml = await ejs.renderFile(
			"./src/emails/submission/coordinator.newsubmission.email.ejs",
			{
				marketingCoordinatorName: marketingCoordinator.name,
				studentName: req.user.name,
				studentEmail: req.user.email,
				submissionDate: new Date(),
				linkToViewSubmission: `${process.env.FRONTEND_URL}/submissions/contribution/${newSubmission._id}`,
			}
		)

		await handleSendEmail({
			to: marketingCoordinator.email,
			subject: "New Submission",
			html: marketingCoordinatorEmailHtml,
		})

		// create notification for the marketing coordinator
		const newNotification = {
			title: "New Submission",
			message: `New submission from ${req.user.name}`,
			actionUrl: `/submissions/${newSubmission._id}`,
			receiver: marketingCoordinator._id,
			doer: req.user._id,
		}

		await Notification.create(newNotification)

		emitNotification(marketingCoordinator._id.toString(), newNotification)

		return res.status(201).json({ newSubmission })
	} catch (error) {
		return res.status(400).json({ error })
	}
}

const getAllSubmissionByContributionId = async (req, res) => {
	try {
		const { contributionId } = req.params
		const { page } = req.query

		const limit = 5
		const skip = (page - 1) * limit

		if (req.user.role == "guest") {
			const contribution = await Contribution.findById(contributionId)

			if (req.user.facultyId.toString() !== contribution.facultyId.toString()) {
				return res
					.status(403)
					.json({ message: "You are not authorized to perform this action" })
			}
		}

		let query = {
			contributionId,
			unsubmitted: false,
		}

		if (req.user.role == "marketing manager" || req.user.role == "guest") {
			query.isSelectedForPublication = true
		}

		const submissions = await Submission.find(query)
			.populate("student", "name email")
			.limit(limit)
			.skip(skip)

		if (!submissions) {
			return res.status(404).json({ message: "No submissions found" })
		}

		const totalLength = await Submission.countDocuments({
			contributionId,
			unsubmitted: false,
		})

		const totalPage = Math.ceil(totalLength / limit)

		return res.status(200).json({ submissions, totalPage, totalLength })
	} catch (error) {
		res.status(400).json({ error })
	}
}

const updateForPublication = async (req, res) => {
	try {
		const { submissionId } = req.params

		//check if articleIds is empty
		if (!submissionId) {
			return res.status(400).json({
				status: "error",
				message: "Submission Id is required",
			})
		}

		// check marketing coordinator is the marketing coordinator of the faculty
		const submission = await Submission.findById(submissionId)

		// Check if the submission exists
		if (!submission) {
			return res.status(404).json({ message: "Submission not found" })
		}

		const contribution = await Contribution.findById(
			submission.contributionId
		).populate("facultyId", "marketingCoordinatorId")

		if (
			req.user._id.toString() !==
			contribution.facultyId.marketingCoordinatorId.toString()
		) {
			return res
				.status(403)
				.json({ message: "You are not authorized to perform this action" })
		}

		// Check if the closure date has passed
		const currentDate = new Date()
		if (currentDate > contribution.finalClosureDate) {
			return res.status(400).json({
				message: "The final closure date has passed",
			})
		}

		const submissionComments = await Comment.find({ submissionId })
		// Check if the submission has any comments
		if (submissionComments.length === 0) {
			return res.status(400).json({
				message: "Submission has no comments",
			})
		}

		// Update article with the given ID to set isSelectedForPublication
		submission.isSelectedForPublication = submission.isSelectedForPublication
			? false
			: true

		const updatedSubmission = await submission.save()

		return res.status(200).json({
			updatedSubmission,
		})
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const toggleSubmissionStatus = async (req, res) => {
	try {
		const { submissionId } = req.params
		const submission = await Submission.findById(submissionId)

		if (!submission) {
			return res.status(404).json({ message: "Submission not found" })
		}

		// Check if the submission belongs to the student
		if (submission.student._id.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ message: "You are not authorized to perform this action" })
		}

		// Check if the final closure date is passed
		if (new Date() > submission.contributionId.finalClosureDate) {
			return res
				.status(400)
				.json({ message: "The final closure date has passed" })
		}

		// update the unsubmitted field
		submission.unsubmitted = !submission.unsubmitted
		const updatedSubmission = await submission.save()

		// find the marketing coordinator of the faculty
		const faculty = await Faculty.findById(req.user.facultyId)
		const marketingCoordinator = await User.findById(
			faculty.marketingCoordinatorId
		)

		const emailCoordinatorParams = {
			marketingCoordinatorName: marketingCoordinator.name,
			studentName: req.user.name,
			studentEmail: req.user.email,
			submissionDate: new Date(),
			linkToViewSubmission: `${process.env.FRONTEND_URL}/submissions/contribution/${submission._id}`,
		}

		let emailCoordinatorHtml

		if (submission.unsubmitted) {
			emailCoordinatorHtml = await ejs.renderFile(
				"./src/emails/submission/coordinator.unsubmitted.email.ejs",
				emailCoordinatorParams
			)
		} else {
			emailCoordinatorHtml = await ejs.renderFile(
				"./src/emails/submission/coordinator.newsubmission.email.ejs",
				emailCoordinatorParams
			)
		}

		// send email to the marketing coordinator
		await handleSendEmail({
			to: marketingCoordinator.email,
			subject: "Submission Status",
			html: emailCoordinatorHtml,
		})

		// send email to student if the submission is submitted
		if (!submission.unsubmitted) {
			const emailStudentHtml = await ejs.renderFile(
				"./src/emails/submission/student.received.email.ejs"
			)

			await handleSendEmail({
				to: req.user.email,
				subject: "Submission Submitted",
				html: emailStudentHtml,
			})
		}

		// create notification for the marketing coordinator
		const newNotification = {
			title: "Submission Status",
			message: `Submission status has been updated by ${req.user.name}`,
			actionUrl: `/submissions/contribution/${submission.contributionId}`,
			receiver: marketingCoordinator._id,
			doer: req.user._id,
		}

		await Notification.create(newNotification)

		emitNotification(marketingCoordinator._id.toString(), newNotification)

		return res.status(200).json({ updatedSubmission })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const getSubmissionByContributionId = async (req, res) => {
	try {
		const { contributionId } = req.params

		const submission = await Submission.findOne({
			contributionId,
			student: req.user._id,
		})

		if (!submission) {
			return res.status(404).json({ error: "No submission found!" })
		}

		return res.status(200).json({ submission })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

// update the submission with the given ID
const addArticlesToSubmission = async (req, res) => {
	try {
		const { submissionId } = req.params

		const { newArticleIds } = req.body

		//check if articleIds is empty
		if (!newArticleIds) {
			return res.status(400).json({ error: "Article Ids are required" })
		}

		// Check if the submission exists
		const submission = await Submission.findById(submissionId)

		if (!submission) {
			return res.status(404).json({ error: "Submission not found" })
		}

		// Check if the submission belongs to the student
		if (submission.student._id.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ error: "You are not authorized to perform this action" })
		}

		// Check if the final closure date is passed
		if (new Date() > submission.contributionId.finalClosureDate) {
			return res
				.status(400)
				.json({ error: "The final closure date has passed" })
		}

		// check if articles exists
		const addedArticles = await Article.find({
			_id: { $in: newArticleIds },
		})

		// if the length of the addedArtices is different from the newArticleIds, return error
		if (addedArticles.length != newArticleIds.length) {
			return res.status(400).json({
				error: "One or many articles ids are not exist.",
			})
		}

		// Update the submission articles array
		const updatedSubmission = await Submission.findByIdAndUpdate(
			submissionId,
			{
				$addToSet: { articles: newArticleIds },
			},
			{ new: true }
		)

		return res.status(200).json({ updatedSubmission })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

// remove aritcles from submission
const removeArticlesFromSubmission = async (req, res) => {
	try {
		const { submissionId } = req.params
		const { articleIds } = req.body
		//check if articleIds is empty
		if (!articleIds) {
			return res.status(400).json({ error: "Article Ids are required" })
		}
		// Check if the submission exists
		const submission = await Submission.findById(submissionId)
		if (!submission) {
			return res.status(404).json({ error: "Submission not found" })
		}
		// Check if the submission belongs to the student
		if (submission.student._id.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ error: "You are not authorized to perform this action" })
		}
		// Check if the final closure date is passed
		if (new Date() > submission.contributionId.finalClosureDate) {
			return res
				.status(400)
				.json({ error: "The final closure date has passed" })
		}
		// Update the submission articles array
		const updatedSubmission = await Submission.findByIdAndUpdate(
			submissionId,
			{
				$pullAll: { articles: articleIds },
			},
			{ new: true }
		)
		return res.status(200).json({ updatedSubmission })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

// download submission articles and zip them
const downloadSubmission = async (req, res) => {
	try {
		const { submissionId } = req.params

		const submission = await Submission.findById(submissionId)

		if (!submission) {
			return res.status(404).json({ message: "Submission not found" })
		}

		const articles = await Article.find({ _id: { $in: submission.articles } })

		const htmlPDF = new PuppeteerHTMLPDF()
		htmlPDF.setOptions({ format: "A4" })

		let zip = new JSZip()

		// Download and save articles
		for (let article of articles) {
			if (article.type === "word") {
				const pdfBuffer = await htmlPDF.create(article.content)
				const filePath = path.join(
					__dirname,
					`../../public/uploads/${article.title}.pdf`
				)
				await htmlPDF.writeFile(pdfBuffer, filePath)
				zip.file(`${article.title}.pdf`, fs.readFileSync(filePath))
				// delete the pdf after zipping

				fs.rmSync(filePath)
			} else {
				const articleTitle = article.title
				const articleImages = article.content
				const articleFolder = path.join(
					__dirname,
					`../../public/uploads/${articleTitle}`
				)

				// Create directories asynchronously
				await fs.promises
					.mkdir(articleFolder, { recursive: true })
					.catch((err) => {
						console.error("Error creating directory:", err)
					})

				let imagesFolder = zip.folder(articleTitle)

				for (let [imageIndex, image] of articleImages.entries()) {
					if (image.startsWith("http")) {
						await new Promise((resolve, reject) => {
							const imagePath = path.join(articleFolder, `${imageIndex}.png`)
							const fileStream = fs.createWriteStream(imagePath)
							fileStream.on("error", (err) => {
								console.error("Error writing image:", err)
								reject(err)
							})

							https
								.get(image, (response) => {
									response.pipe(fileStream)
									fileStream.on("finish", () => {
										const imageData = fs.readFileSync(imagePath)
										imagesFolder.file(`${imageIndex}.png`, imageData)
										resolve()
									})
								})
								.on("error", (e) => {
									console.error("Error downloading image:", e)
									reject(e)
								})
						})
					}
				}
			}
		}

		let zipBuffer = await zip.generateAsync({ type: "nodebuffer" })
		let zipFileName = `submission-${submissionId}.zip`
		res.setHeader("Content-Disposition", `attachment; filename=${zipFileName}`)
		res.setHeader("Content-Type", "application/zip")

		// delete the folder after zipping
		for (let article of articles) {
			if (article.type === "image") {
				const articleTitle = article.title
				const articleFolder = path.join(
					__dirname,
					`../../public/uploads/${articleTitle}`
				)
				fs.rmSync(articleFolder, { recursive: true })
			}
		}

		return res.send(zipBuffer)
	} catch (error) {
		console.log("error", error)
		return res.status(500).json({ error: error.message })
	}
}

// remove submission by id
const removeSubmission = async (req, res) => {
	try {
		const { submissionId } = req.params

		await Submission.findByIdAndDelete(submissionId)

		// Delete all comments of the submission
		await Comment.deleteMany({ submissionId })

		return res.status(200).json({ message: "Submission deleted successfully" })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

module.exports = {
	getSubmissionById,
	createSubmission,
	getAllSubmissionByContributionId,
	getSubmissionByContributionId,
	updateForPublication,
	addArticlesToSubmission,
	removeArticlesFromSubmission,
	removeSubmission,
	getUnselectedArticlesOfStudentsBySubmissionId,
	toggleSubmissionStatus,
	downloadSubmission,
}
