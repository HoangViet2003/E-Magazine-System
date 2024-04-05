const { Article, Comment, Submission,Faculty,Contribution } = require("../models")
const EmitterSingleton = require("../configs/eventEmitter")
// const { sendMail,handleSendEmail } = require("../utils")
const path = require("path")
const { handleSendEmail,sendMail } = require("../utils/sendMail")

const emitterInstance = EmitterSingleton.getInstance()
const emitter = emitterInstance.getEmitter()

const ejs = require("ejs")

const getCommentsByAr = async (req, res) => {
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
		})

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
        const { id } = req.params;
        const { content, taggedUserId } = req.body;

        let submission;

        // Check if the user's role is marketing coordinator of the article's contribution or the student who wrote the article
        if (
            req.user.role !== "marketing coordinator" &&
            req.user.role !== "student"
        ) {
            return res.status(403).json({ error: "Forbidden" });
        } else {
            // Find the submission that the comment belongs to
            submission = await Submission.findById(id);

            if (!submission) {
                return res.status(404).json({ error: "Submission does not exist" });
            }

			const contribution = await Contribution.findById(submission.contributionId)


            // if the role is marketing coordinator, check if the facultyId matches the facultyId of the submission
            // if the role is student, check if the student is the author of the submission, if not return 403
            if (req.user.role === "marketing coordinator") {
                if (
                    req.user.facultyId.toString() !==
                    contribution.facultyId.toString()
                ) {
                    return res.status(403).json({ error: "Forbidden" });
                }
            } else {
                if (req.user._id.toString() !== submission.student._id.toString()) {
                    return res.status(403).json({ error: "Forbidden" });
                }
            }
        }

        // Example of creating a new comment
        const newComment = new Comment({
            submissionId: id,
            userId: req.user._id, // Assuming user ID is stored in req.user
            content,
            taggedUserId,
        });

        await newComment.save();

        const html = await ejs.renderFile(
            "./src/emails/comments/crudComments.email.ejs",
            {
                comment: newComment,
            }
        );

        // await sendMail({
        //     to: "tuananhngo2513@gmail.com",
        //     subject: `${req.user.name} has commented on the submission`,
        //     html,
        // });

		handleSendEmail({
			     to: "tuananhngo2513@gmail.com",
            subject: `${req.user.name} has commented on the submission`,
            html,
		})

        return res
            .status(201)
            .json({ newComment, message: "Comment added successfully" });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
};



const replyComment = async (req, res) => {
	try {
		const { id } = req.params
		let comment
		let submission

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
			// article = await Article.findById(comment.articleId)
			submission = await Submission.findById(comment.submissionId)

			// if the role is marketing coordination, check if the contributionId matches the contributionId of the article
			// if the role is student, check if the student is the author of the article, if not return 403
			if (req.user.role === "marketing coordinator") {
				if (
					req.user.contributionId.toString() !==
					submission.contributionId.toString()
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
		const newComment = new Comment({
			submissionIdId: submission._id,
			userId: req.user._id,
			content,
			taggedUserId,
			parentCommentId: comment._id,
		})

		// Saving the new comment
		await newComment.save()

		// Emit an event to notify the author of the parent comment
		emitter.emit("newReply", {
			comment,
			newComment,
		})

		// Send an email to the author of the parent comment
		const html = await ejs.renderFile(
			path.join(__dirname, "../emails/comments/crudComments.email.ejs"),
			{
				comment: newComment,
			}
		)

		// Send an email to the author of the parent comment
		await sendMail({
			to: "tuananhngo2513@gmail.com",
			subject: `${req.user.name} has replied to your comment`,
			html,
		})

		return res
			.status(201)
			.json({ newComment, message: "Comment added successfully" })
	} catch (error) {
		return res.status(500).json({ error: "Internal Server Error" })
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

module.exports = { getCommentsByAr, addComment, replyComment, deleteComment }
