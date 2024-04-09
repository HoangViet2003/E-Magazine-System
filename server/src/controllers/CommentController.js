const {
	Article,
	Comment,
	Submission,
	Faculty,
	Notification,
	Contribution,
	User,
} = require("../models")
const EmitterSingleton = require("../configs/eventEmitter")
const path = require("path")
const { handleSendEmail, sendMail } = require("../utils/sendMail")

const emitterInstance = EmitterSingleton.getInstance()
const emitter = emitterInstance.getEmitter()
const {emitNotification} = require('../utils/initSocket')
const ejs = require("ejs")

const getCommentsBySubmission = async (req, res) => {
	try {
		const { id } = req.params
		const { page } = req.query

		// if the user's role is guest, return an error message
		if (req.user.role === "guest") {
			return res.status(403).json({ error: "Forbidden" })
		}

		// Check if page number is not provided or invalid
		if (!page || isNaN(page) || page < 1) {
			return res.status(400).json({ error: "Invalid page number" })
		}

		// const article = await Article.findById(id)
		const submission = await Submission.findById(id)

		// Check if article exists
		if (!submission) {
			return res.status(404).json({ error: "Submission does not exist" })
		}

		let comments = await Comment.find({
			submissionId: id,
			parentCommentId: { $exists: false },
		})
			.populate("userId", "name")
			.sort({ createdAt: -1 })
			.skip((page - 1) * 10)
			.limit(10)

		const replies = await Comment.find({
			submissionId: id,
			parentCommentId: { $exists: true },
		}).populate("userId", "name")

		// add replies to the comments
		comments = comments.map((comment) => {
			const commentReplies = replies.filter(
				(reply) => reply.parentCommentId.toString() === comment._id.toString()
			)
			return {
				...comment._doc,
				replies: commentReplies,
			}
		})

		// calculate the total pages
		const totalComments = await Comment.countDocuments({
			submissionId: id,
			parentCommentId: { $exists: false },
		})
		const totalPages = Math.ceil(totalComments / 10)

		return res.status(200).json({
			comments,
			totalPages,
			totalLength: totalComments,
		})
	} catch (error) {
		return res.status(500).json({ error: "Internal Server Error" })
	}
}

const addComment = async (req, res) => {
	try {
		const { id } = req.params
		const { content, taggedUserId } = req.body

		let submission

		// Check if the user's role is marketing coordinator of the article's contribution or the student who wrote the article
		if (
			req.user.role !== "marketing coordinator" &&
			req.user.role !== "student"
		) {
			return res.status(403).json({ error: "Forbidden" })
		} else {
			// Find the submission that the comment belongs to
			submission = await Submission.findById(id)

			if (!submission) {
				return res.status(404).json({ error: "Submission does not exist" })
			}

			const contribution = await Contribution.findById(
				submission.contributionId
			)

			// if the role is marketing coordinator, check if the facultyId matches the facultyId of the submission
// if the role is student, check if the student is the author of the submission, if not return 403
			if (req.user.role === "marketing coordinator") {
				if (
					req.user.facultyId.toString() !== contribution.facultyId.toString()
				) {
					return res.status(403).json({ error: "Forbidden" })
				}
			} else {
				if (req.user._id.toString() !== submission.student._id.toString()) {
					return res.status(403).json({ error: "Forbidden" })
				}
			}
		}

		submission = await Submission.findById(id)

		// Example of creating a new comment
		const newComment = new Comment({
			submissionId: id,
			userId: req.user._id, // Assuming user ID is stored in req.user
			content,
		})

		let returnedNewComment = await newComment
			.save()
			.then((comment) => comment.populate("userId", "name"))
			.then((comment) => comment)

		// format the comment.createdAt to dd/mm/yyyy hh:mm; locale is +7 Vietnam timezone
		const date = new Date(returnedNewComment.createdAt)
		date.setHours(date.getHours() + 7)
		// format the date to dd/mm/yyyy hh:mm
		const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`

		returnedNewComment.createdAt = formattedDate

		const html = await ejs.renderFile(
			"./src/emails/comments/crudComments.email.ejs",
			{
				comment: returnedNewComment,
			}
		)

		// if the author comment, send email to marketing coordinator, else send email to the author of the parent comment
		if (req.user.role === "marketing coordinator") {
			// find the author of the submission
			const submission = await Submission.findById(id)

			// find the author of the submission
			const studentEmail = submission.student.email

			// Send email to the student
			await sendMail({
				to: studentEmail,
				subject: `Marketing coordinator: ${req.user.name} has commented on your submission.`,
				html,
			})

			// Create a new notification
			const newNotification = new Notification({
				title: "New Comment on Submission",
				doer: req.user._id,
				receiver: submission.student._id,
				message: `Marketing coordinator: ${req.user.name} has commented on your submission.`,
				actionUrl: `/submissions/${submission._id}`,
			})

			emitNotification(
				submission.student._id.toString(),
				`Marketing coordinator: ${req.user.name} has commented on your submission.`
			)

			await newNotification.save()
		} else if (req.user.role == "student") {
			// Check if there are any comments that the marketing coordinator has made on the submission
			const contribution = await Contribution.findById(
				submission.contributionId
			)
			const faculty = await Faculty.findById(contribution.facultyId)
			const marketingCoordinator = await User.findOne({
				facultyId: faculty._id,
				role: "marketing coordinator",
			})

			const comments = await Comment.find({
				submissionId: id,
				userId: marketingCoordinator._id,
			})

			if (comments.length > 0) {
				// Send email to the marketing coordinator
await sendMail({
					to: marketingCoordinator.email,
					subject: `${req.user.name} has commented on the submission`,
					html,
				})

				// Create a new notification
				const newNotification = new Notification({
					title: "New Comment on Submission",
					doer: req.user._id,
					receiver: marketingCoordinator._id,
					message: `${req.user.name} has commented on the submission.`,
					actionUrl: `/submissions/${submission._id}`,
				})

				
			emitNotification(
				marketingCoordinator._id.toString(),
				`${req.user.name} has commented on the submission.`
			)

				await newNotification.save()
			}
		}

		return res.status(201).json({ newComment })
	} catch (error) {
		console.error(error) // Log the error for debugging purposes
		return res
			.status(500)
			.json({ error: "Internal Server Error: " + error.message })
	}
}

const replyComment = async (req, res) => {
	try {
		const { commentId } = req.params
		let submission

		const comment = await Comment.findById(commentId).populate("userId", "name")
		if (!comment) {
			return res.status(404).json({ error: "Comment does not exist" })
		}

		// Check if the user's role is marketing coordinator of the article's contribution or the student who wrote the article
		if (
			req.user.role !== "marketing coordinator" &&
			req.user.role !== "student"
		) {
			return res.status(403).json({ error: "Forbidden" })
		} else {
			// Find the submission that the comment belongs to
			submission = await Submission.findById(comment.submissionId)

			if (!submission) {
				return res.status(404).json({ error: "Submission does not exist" })
			}

			const contribution = await Contribution.findById(
				submission.contributionId
			)

			// if the role is marketing coordinator, check if the facultyId matches the facultyId of the submission
			// if the role is student, check if the student is the author of the submission, if not return 403
			if (req.user.role === "marketing coordinator") {
				if (
					req.user.facultyId.toString() !== contribution.facultyId.toString()
				) {
					return res.status(403).json({ error: "Forbidden" })
				}
			} else {
				if (req.user._id.toString() !== submission.student._id.toString()) {
					return res.status(403).json({ error: "Forbidden" })
				}
			}
		}

		const { content, taggedUserId } = req.body

		// Creating a new comment
		let newComment = new Comment({
			submissionId: comment.submissionId,
			userId: req.user._id,
			content,
			taggedUserId,
			parentCommentId: comment._id,
		})

		// Saving the new comment
		await newComment
			.save()
			.then((comment) => comment.populate("userId", "name"))
			.then((comment) => (newComment = comment))

		//TODO: Emit an event to notify the author of the parent comment

		// get all replies of the parent comment
		const replies = await Comment.find({
			submissionId: comment.submissionId,
			parentCommentId: comment._id,
		}).populate("userId", "name")

		comment["replies"] = replies
const html = await ejs.renderFile(
			path.join(__dirname, "../emails/comments/crudComments.email.ejs"),
			{
				comment: comment,
			}
		)

		// if the author comment, send email to marketing coordinator, else send email to the author of the parent comment
		if (req.user.role === "marketing coordinator") {
			// find the author of the submission
			const submission = await Submission.findById(comment.submissionId)

			// find the author of the submission
			const studentEmail = submission.student.email

			// Send email to the student
			await sendMail({
				to: studentEmail,
				subject: `Marketing coordinator: ${req.user.name} has replied to your comment`,
				html,
			})

			// Create a new notification
			const newNotification = new Notification({
				title: "New Reply to your Comment",
				doer: req.user._id,
				receiver: submission.student._id,
				message: `Marketing coordinator: ${req.user.name} has replied to your comment.`,
				actionUrl: `/submissions/${submission._id}`,
			})

			emitNotification(submission.student._id.toString(), `Marketing coordinator: ${req.user.name} has replied to your comment.`)

			await newNotification.save()
		} else if (req.user.role == "student") {
			// Check if there are any comments that the marketing coordinator has made on the submission
			const contribution = await Contribution.findById(
				submission.contributionId
			)
			const faculty = await Faculty.findById(contribution.facultyId)
			const marketingCoordinator = await User.findOne({
				facultyId: faculty._id,
				role: "marketing coordinator",
			})

			const comments = await Comment.find({
				submissionId: comment.submissionId,
				userId: marketingCoordinator._id,
			})

			if (comments.length > 0) {
				// Send email to the marketing coordinator
				await sendMail({
					to: marketingCoordinator.email,
					subject: `${req.user.name} has replied to your comment.`,
					html,
				})

				// Create a new notification
				const newNotification = new Notification({
					title: "New Reply to your Comment",
					doer: req.user._id,
					receiver: marketingCoordinator._id,
					message: `${req.user.name} has replied to your comment.`,
					actionUrl: `/submissions/${submission._id}`,
				})

				emitNotification(marketingCoordinator._id.toString(), `${req.user.name} has replied to your comment.`)

				await newNotification.save()
			}
		}

		return res.status(201).json({ newComment })
	} catch (error) {
		console.error(error) // Log the error for debugging purposes
		return res
			.status(500)
			.json({ error: "Internal Server Error", messsage: error.message })
	}
}

const deleteComment = async (req, res) => {
	try {
		const { id } = req.params
		let comment
		let article

		// Check if the user's role is marketing coordinator of the article's contribution or the student who wrote the article
		if (
			req.user.role !== "marketing coordinator" &&
			req.user.role !== "student"
		) {
			return res.status(403).json({ error: "Forbidden" })
} else {
			comment = await Comment.findById(id)

			if (!comment) {
				return res.status(404).json({ error: "Comment does not exist" })
			}

			// Find the article that the comment belongs to
			article = await Article.findById(comment.articleId)

			// if the role is marketing coordination, check if the contributionId matches the contributionId of the article
			// if the role is student, check if the student is the author of the article, if not return 403
			if (req.user.role === "marketing coordinator") {
				if (
					req.user.contributionId.toString() !==
					article.contributionId.toString()
				) {
					return res.status(403).json({ error: "Forbidden" })
				}
			} else {
				if (req.user._id.toString() !== article.student.toString()) {
					return res.status(403).json({ error: "Forbidden" })
				}
			}

			// If user is not the one who created the comment, return 403
			if (req.user.id.toString() !== comment.userId.toString()) {
				return res.status(403).json({ error: "Forbidden" })
			}
		}

		// If there are any comments that have parentCommentId equal to the id of the comment to be deleted, delete those comments as well
		await Comment.deleteMany({ parentCommentId: id })

		// Delete the comment
		await Comment.findByIdAndDelete(id)

		return res.status(200).json({ message: "Comment deleted successfully" })
	} catch (error) {
		return res.status(500).json({ error: "Internal Server Error" })
	}
}

module.exports = {
	getCommentsBySubmission,
	addComment,
	replyComment,
	deleteComment,
}