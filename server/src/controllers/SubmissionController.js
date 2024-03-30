const {
	Submission,
	Contribution,
	Faculty,
	User,
	Notification,
} = require("../models")
const ejs = require("ejs")
const { handleSendEmail } = require("../utils/sendMail")
const { emitNotification } = require("../utils/initSocket")

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
			actionUrl: `/submissions/contribution/${contribution._id}`,
			receiver: marketingCoordinator._id,
			doer: req.user._id,
		}

		await Notification.create(newNotification)

		emitNotification(marketingCoordinator._id, newNotification)

		return res.status(201).json({ newSubmission })
	} catch (error) {
		return res.status(400).json({ error })
	}
}

//get all submissions
const getAllSubmissions = async (req, res) => {
	try {
		const submissions = await Submission.find()
		res.status(200).json({ submissions })
	} catch (error) {
		res.status(400).json({ error })
	}
}

const getAllSubmissionByContributionId = async (req, res) => {
	try {
		const { contributionId } = req.params
		const submissions = await Submission.find({ contributionId })

		if (!submissions && !contributionId) {
			return res
				.status(404)
				.json({ message: "No submissions found for the contribution" })
		}

		res.status(200).json({ submissions })
	} catch (error) {
		res.status(400).json({ error })
	}
}

//get submission by student id
const getSubmissionByStudentId = async (req, res) => {
	try {
		const { contributionId } = req.query
		const student = req.user

		const submission = await Submission.findOne({
			user: student._id,
			contributionId,
		})

		if (!submission) {
			return res
				.status(404)
				.json({ message: "No submission found for the student" })
		}

		res.status(200).json({ submission })
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
		const submission = await Submission.findById(submissionId).populate(
			"contributionId",
			"facultyId"
		)

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

		// Check if the submission is already selected for publication
		if (submission.isSelectedForPublication) {
			return res.status(400).json({
				message: "Submission is already selected for publication",
			})
		}

		// Check if the closure date has passed
		const currentDate = new Date()
		if (currentDate > contribution.finalClosureDate) {
			return res.status(400).json({
				message: "The closure date has passed",
			})
		}

		// Check if the submission has any comment
		if (submission.comments.length === 0) {
			return res.status(400).json({
				message: "Submission has no comments",
			})
		}

		// Update article with the given ID to set isSelectedForPublication to true
		const updatedSubmission = await Submission.findByIdAndUpdate(
			submissionId,
			{
				$set: { isSelectedForPublication: true },
			},
			{ new: true } // To get the updated document back
		)

		return res.status(200).json({
			updatedSubmission,
		})
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

module.exports = {
	createSubmission,
	getAllSubmissions,
	getAllSubmissionByContributionId,
	getSubmissionByStudentId,
	updateForPublication,
}
