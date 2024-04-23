const fs = require("fs")
const { uploadFiles, deleteFiles } = require("../services/fileS3.services")

const mammoth = require("mammoth")

const {
	Article,
	Contribution,
	History,
	Faculty,
	Comment,
	Submission,
} = require("../models")

const uploadArticle = async (req, res) => {
	try {
		const { type, title } = req.body
		const student = req.user

		if (!req.files || req.files.length === 0) {
			return res.status(400).json({
				status: "error",
				message: "No file uploaded",
			})
		}

		let article

		// Check if contribution exists
		if (type === "word") {
			const articlePromises = req.files.map(async (file) => {
				if (
					file.mimetype !==
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
				) {
					throw new Error("Please upload Word documents (.docx)")
				}

				const filePath = file.path
				const result = await mammoth.convertToHtml({ path: filePath })
				console.log("html: ", result)
				console.log("html2: ", result.value)
				const html = result.value // The generated HTML

				return {
					student: student._id,
					title: file.originalname,
					content: html,
					type: type,
					facultyId: student.facultyId,
				}
			})

			const newArticles = await Promise.all(articlePromises)
			await fs.promises.unlink(req.files[0].path) // Assuming one file for "word"

			// Save the updated contribution
			article = await Article.create(newArticles)
		} else if (type === "image") {
			// If Type is "image" and images are uploaded
			const uploadPromises = req.files.map(async (file) => {
				try {
					await uploadFiles(file, "articles/")
					await fs.promises.unlink(file.path)

					if (!file.mimetype.startsWith("image")) {
						// Invalid file type for "image"
						throw new Error("Please upload only image files")
					}

					return `https://magazine-images-upload.s3.ap-southeast-1.amazonaws.com/articles/${file.originalname}`
				} catch (error) {
					return null
				}
			})

			const uploadResults = await Promise.allSettled(uploadPromises)

			const images = uploadResults
				.filter((result) => result.status === "fulfilled")
				.map((result) => result.value)

			article = await Article.create({
				student: student._id,
				title,
				type,
				content: images,
				facultyId: student.facultyId,
			})
		} else {
			return res.status(400).send({
				status: "error",
				message: "Invalid Type or Missing File",
			})
		}

		const history = await History.create({
			action: "create",
			userId: student._id,
			content: "Student has uploaded an article."
		})

		//TODO: Delete the files from the server
		// await req.files.forEach(async (file) => {
		// 	await fs.promises.unlink(file.path);
		// });

		return res.status(201).send({
			message: "Article uploaded successfully",
			article: type === "word" ? article : [article],
			history,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const updateArticle = async (req, res) => {
	const { articleId } = req.params
	const { content, title } = req.body
	const { files } = req

	try {
		const article = await Article.findById(articleId)

		if (!article) {
			throw new Error("Article does not exist!")
		}

		if (title) {
			article.title = title
		}

		if (article.type === "word" && content) {
			//update content in article to new content
			article.content[0] = content
		}

		if (files && files.length > 0 && article.type === "image") {
			console.log("files: ", files)
			const uploadPromises = files.map(async (file) => {
				// Assuming uploadFiles and deleteFiles functions are defined
				// Upload new images
				await uploadFiles(file, "articles/")
				await fs.promises.unlink(file.path)
				return `https://magazine-images-upload.s3.ap-southeast-1.amazonaws.com/articles/${file.originalname}`
			})

			const uploadedImages = await Promise.all(uploadPromises)

			const imagesToDelete = content
				? article.content.filter((image) => !content.includes(image))
				: article.content

			// Delete images not kept
			await deleteFiles(imagesToDelete, "articles/")

			// Update article images
			article.content = content
				? [...content, ...uploadedImages]
				: uploadedImages
		} else if (content && article.type === "image") {
			// Delete images not kept
			const imagesToDelete = article.content.filter(
				(image) => !content.includes(image)
			)
			await deleteFiles(imagesToDelete, "articles/")

			// Update article images
			article.content = content
		}

		// Update other fields
		Object.keys(req.body).forEach((field) => {
			if (field !== "content" && field !== "images") {
				article[field] = req.body[field]
			}
		})

		// Save updated article
		await article.save()

		return res.send({
			status: "success",
			message: "Article updated successfully",
			article,
		})
	} catch (error) {
		return res.status(500).send({ status: "error", message: error.message })
	}
}

//create word file
const createBlankWordFile = async (req, res) => {
	try {
		const user = req.user

		const { contributionId } = req.body

		const article = await Article.create({
			title: "Blank Article",
			type: "word",
			student: user._id,
			contributionId,
			facultyId: user.facultyId,
		})

		res.status(201).json({ article })
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

//getAll article by studentId
const getAllArticlesByStudentId = async (req, res) => {
	try {
		// return result
		const student = req.user

		const page = parseInt(req.query.page) || 1
		const limit = 5
		const skip = (page - 1) * limit

		const articles = await Article.find({
			student: student._id,
		})
			.sort({
				createdAt: -1,
			})
			.skip(skip)
			.limit(limit)

		const totalLength = await Article.find({
			student: student._id,
		}).countDocuments()

		res.status(200).json({
			articles,
			totalPage: Math.ceil(totalLength / limit),
			totalLength: totalLength,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

//get all article by submissionId
const getAllArticlesBySubmissionId = async (req, res) => {
	try {
		const { submissionId } = req.params
		const page = parseInt(req.query.page) || 1
		const limit = 5
		const skip = (page - 1) * limit

		const submission = await Submission.findById(submissionId)

		if (!submission) {
			return res.status(404).json({ error: "Submission not found" })
		}

		const articles = await Article.find({
			_id: { $in: submission.articles },
		})
			.skip(skip)
			.limit(limit)
			.select("title type student status updatedAt")

		const totalLength = await Article.find({
			_id: { $in: submission.articles },
		}).countDocuments()

		res.status(200).json({
			articles,
			totalPage: Math.ceil(totalLength / limit),
			totalLength: totalLength,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

//get article by id
const getArticleById = async (req, res) => {
	try {
		const { articleId } = req.params
		const user = req.user

		const article = await Article.findOne({ _id: articleId }).populate(
			"student",
			"name email facultyId"
		)

		if (!article) {
			return res
				.status(404)
				.json({ status: "error", error: "Article not found" })
		}

		// Check if user is a student and the article's student is not the current user
		if (
			user.role === "student" &&
			article.student._id.toString() !== user._id.toString()
		) {
			return res
				.status(403)
				.json({ error: "You are not allowed to perform this action" })
		}

		// if user is a marketing coordinator, check if the article's faculty is the same as the user's faculty
		if (
			(user.role == "marketing coordinator" || user.role == "guest") &&
			article.student.facultyId.toString() != req.user.facultyId.toString()
		) {
			return res
				.status(403)
				.json({ error: "You are not allowed to perform this action" })
		}

		// Check if a managner, check if the article status is selected
		if (user.role == "marketing manager" && article.status !== "selected") {
			return res
				.status(403)
				.json({ error: "You are not allowed to perform this action" })
		}
		res.status(200).json({ article })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// get submission info by contributionId

//get All article by facultyId
const getAllArticlesByFacultyId = async (req, res) => {
	try {
		const facultyId = req.params.facultyId
		const page = parseInt(req.query.page) || 1
		const limit = 5
		const skip = (page - 1) * limit

		// Find articles for the faculty with pagination
		const articles = await Article.find({ facultyId: facultyId })
			.skip(skip)
			.limit(limit)

		// Count total number of articles for pagination
		const totalLength = await Article.countDocuments({ facultyId: facultyId })

		res.status(200).json({
			articles,
			totalPage: Math.ceil(totalLength / limit),
			totalLength: totalLength,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

//delete article by id
const deleteArticle = async (req, res) => {
	try {
		const { articleId } = req.params

		const article = await Article.findById(articleId).populate(
			"student",
			"_id role facultyId"
		)

		if (!article) {
			return res
				.status(404)
				.json({ status: "error", error: "Article not found" })
		}

		if (article.status !== "draft") {
			// finding the submission of the article
			const submission = await Submission.findById(article.submissionId)

			// if the closure date of the submission is passed, the article cannot be deleted
			if (submission.closureDate < new Date()) {
				return res.status(403).json({
					error:
						"The closure date of the submission has passed. You cannot delete the article",
				})
			}

			// if the status of the article is selected, the article cannot be deleted
			if (article.status === "selected") {
				return res.status(403).json({
					error: "The article has been selected. You cannot delete the article",
				})
			}
		}

		// if the user is not student and the owner of the article is not the user, the article cannot be deleted
		if (article.student._id.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ error: "You are not allowed to perform this action" })
		}

		// check if article is in any submission
		const submission = await Submission.findOne({
			articles: articleId,
		})

		// if submission, remove the article ids from the submisison articles array
		if (submission) {
			await Submission.updateOne(
				{ _id: submission._id },
				{ $pull: { articles: articleId } }
			)
		}

		await Article.findByIdAndDelete(articleId)

		res.status(200).json({ message: "Article deleted" })
	} catch (error) {
		console.log("error: ", error)
		res.status(500).json({ error: error.message })
	}
}

const updateArticleFavorite = async (req, res) => {
	try {
		const { articleIds } = req.body

		//check if articleId is empty
		if (!articleIds) {
			return res.status(400).json({
				message: "Article IDs array is required",
			})
		}

		// Update article with the given ID to set isFavorite to true
		const updatedArticles = await Article.updateMany(
			{ _id: { $in: articleIds } },
			{ $set: { isFavorite: true } },
			{ new: true } // To get the updated documents back
		)

		res.status(200).json({
			updatedArticles,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

//search article by title,student name
const getSuggestionArticles = async (req, res) => {
	try {
		const { query } = req.query
		const limit = 5
		const user = req.user

		const articles = await Article.find({
			title: { $regex: new RegExp(query, "i") },
			facultyId: user.facultyId, // Match facultyId of the user
		}).limit(limit)

		res.status(200).json({
			status: "success",
			articles,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const filterArticle = async (req, res) => {
	try {
		const { type, keyword } = req.query
		const page = parseInt(req.query.page) || 1
		const user = req.user
		const limit = 5
		const skip = (page - 1) * limit

		let matchQuery = {
			title: { $regex: new RegExp(keyword, "i") },
		}

		// Adjusted condition to check if the user is not a marketing manager AND not an admin
		if (user.role !== "marketing manager" && user.role !== "admin") {
			matchQuery["facultyId"] = user.facultyId
		}

		let articles

		// Modify matchQuery for students
		if (user.role === "student") {
			matchQuery.student = user._id
		}

		if (type) {
			matchQuery.type = type
		}

		articles = await Article.find(matchQuery)
			.skip(skip)
			.limit(limit)
			.select("_id title type student updatedAt")

		// Using a single aggregation pipeline for fetching articles and getting total count
		const totalLength = await Article.countDocuments(matchQuery)

		res.status(200).json({
			articles,
			totalPage: Math.ceil(totalLength / limit),
			totalLength: totalLength,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

//donwload all article selected as zip file
const downloadAllArticleSelected = async (req, res) => {
	try {
		const { articleIds } = req.body
		const articles = await Article.find({ _id: { $in: articleIds } })

		const files = articles.map((article) => {
			if (article.type === "word") {
				return {
					filename: article.title,
					content: article.content,
				}
			} else {
				return {
					filename: article.title,
					content: article.content,
				}
			}
		})

		const zip = new require("node-zip")()
		files.forEach((file) => {
			zip.file(file.filename, file.content)
		})

		const data = zip.generate({ base64: false, compression: "DEFLATE" })

		res.status(200).json({
			status: "success",
			data,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const getDashboard = async (req, res) => {
	try {
		// If the user role is student or guest, return 403
		if (req.user.role == "student") {
			return res
				.status(403)
				.json({ error: "You are not allowed to perform this action" })
		}

		let { academicYear, facultyId } = req.query

		let query = {}

		// if the user role is marketing coordinator, only get the articles from the contribution of the faculty
		if (req.user.role == "marketing coordinator") {
			const faculty = await Faculty.findOne({
				marketingCoordinatorId: req.user._id,
			})

			const contribution = await Contribution.findOne({
				facultyId: faculty._id,
			})

			// add contributionId to the query
			query["contributionId"] = contribution._id
		} else if (req.user.role == "marketing manager") {
			if (academicYear) {
				query["academicYear"] = academicYear
			} else if (facultyId) {
				const faculty = await Faculty.findById(facultyId)

				const contribution = await Contribution.findOne({
					facultyId: faculty._id,
				})

				query["contributionId"] = contribution._id
			}
		} else {
			if (academicYear) {
				query["academicYear"] = academicYear
			}

			const faculty = await Faculty.findById(req.user.facultyId)
			const contribution = await Contribution.findOne({
				facultyId: faculty._id,
			})
			query["contributionId"] = contribution._id
		}

		// total submission
		const submissions = await Submission.find(query).populate("student", "_id")

		const totalSubmissions = submissions.length

		let totalArticles = 0
		let totalSubmissionsWithComments = 0
		let totalComments = 0
		let totalSelectedSubmissions = 0

		// Aggregate totalArticles and totalSelectedSubmissions
		submissions.forEach((submission) => {
			totalArticles += submission.articles.length
			if (submission.isSelectedForPublication) {
				totalSelectedSubmissions++
			}
		})

		// Aggregate totalComments and totalSubmissionsWithComments
		const commentsPromises = submissions.map((submission) =>
			Comment.countDocuments({ submissionId: submission })
		)
		const commentsCounts = await Promise.all(commentsPromises)
		commentsCounts.forEach((count) => {
			totalComments += count
			if (count > 0) {
				totalSubmissionsWithComments++
			}
		})

		const totalSubmissionsWithoutComments =
			totalSubmissions - totalSubmissionsWithComments

		return res.status(200).json({
			totalArticles,
			totalComments,
			totalSubmissions,
			totalSelectedSubmissions,
			totalSubmissionsWithComments,
			totalSubmissionsWithoutComments,
		})
	} catch (error) {
		console.error("error: ", error)
		return res.status(500).json({ error: error.message })
	}
}

module.exports = {
	uploadArticle,
	updateArticle,
	getAllArticlesByStudentId,
	getArticleById,
	getAllArticlesByFacultyId,
	updateArticleFavorite,
	getSuggestionArticles,
	filterArticle,
	downloadAllArticleSelected,
	deleteArticle,
	getDashboard,
	getAllArticlesBySubmissionId,
	createBlankWordFile,
}
