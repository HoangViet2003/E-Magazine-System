const { Article, Comment } = require("../models");
const EmitterSingleton = require("../configs/eventEmitter");
const { sendMail } = require("../utils");

const emitterInstance = EmitterSingleton.getInstance();
const emitter = emitterInstance.getEmitter();

const ejs = require("ejs");

const getCommentsByAr = async (req, res) => {
	try {
		const { id } = req.params;
		const { page } = req.query;

		// if the user's role is guest, return an error message
		if (req.user.role === "guest") {
			return res.status(403).json({ error: "Forbidden" });
		}

		// Check if page number is not provided or invalid
		if (!page || isNaN(page) || page < 1) {
			return res.status(400).json({ error: "Invalid page number" });
		}

		const article = await Article.findById(id);

		// Check if article exists
		if (!article) {
			return res.status(404).json({ error: "Article does not exist" });
		}

		const comments = await Comment.find({ articleId: id })
			.populate("userId", "username")
			.populate("taggedUserId", "username")
			.sort({ createdAt: -1 })
			.limit(10)
			.skip((page - 1) * 10);

		// calculate total pages
		const totalComments = await Comment.countDocuments({ articleId: id });
		const totalPages = Math.ceil(totalComments / 10);

		return res.status(200).json({
			comments,
			totalPages,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

const addComment = async (req, res) => {
	try {
		const { id } = req.params;
		const { content, taggedUserId } = req.body;

		// Check if the user's role is guest or marketing manager
		if (req.user.role === "guest" || req.user.role === "marketing manager") {
			return res.status(403).json({ error: "Forbidden" });
		}

		// Check if the article exists
		// If the article does not exist, return an error message
		const article = await Article.findById(id);

		if (!article) {
			return res.status(404).json({ error: "Article does not exist" });
		}

		// Example of creating a new comment
		const newComment = new Comment({
			articleId: id,
			userId: req.user._id, // Assuming user ID is stored in req.user
			content,
			taggedUserId,
		});

		// Example of saving the new comment
		await newComment.save();

		const html = await ejs.renderFile(
			"./src/emails/comments/crudComments.email.ejs",
			{
				comment: newComment,
			}
		);

		await sendMail({
			to: "tuananhngo2513@gmail.com",
			subject: `${req.user.name} has commented on the article`,
			html,
		});

		return res
			.status(201)
			.json({ newComment, message: "Comment added successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

const replyComment = async () => {
	try {
		const { id } = req.params;

		// Check if the user's role is marketing coordinator of the article's contribution or the student who wrote the article
		if (
			req.user.role !== "marketing coordinator" ||
			req.user.role !== "student"
		) {
			return res.status(403).json({ error: "Forbidden" });
		} else {
			const comment = await Comment.findById(id);

			if (!comment) {
				return res.status(404).json({ error: "Comment does not exist" });
			}

			// Find the article that the comment belongs to
			const article = await Article.findById(comment.articleId);

			// if the role is marketing coordination, check if the contributionId matches the contributionId of the article
			// if the role is student, check if the student is the author of the article, if not return 403
			if (req.user.role === "marketing coordinator") {
				if (req.user.contributionId !== article.contributionId) {
					return res.status(403).json({ error: "Forbidden" });
				}
			} else {
				if (req.user._id !== article.studentId) {
					return res.status(403).json({ error: "Forbidden" });
				}
			}
		}

		const { content, taggedUserId } = req.body;

		// Creating a new comment
		const newComment = new Comment({
			articleId: article._id,
			userId: req.user._id,
			content,
			taggedUserId,
		});

		// Saving the new comment
		await newComment.save();

		// Add the new comment to the replies array of the parent comments
		comment.replies.push(newComment._id);
		await comment.save();

		// Emit an event to notify the author of the parent comment
		emitter.emit("newReply", {
			comment,
			newComment,
		});

		// Send an email to the author of the parent comment
		const html = await ejs.renderFile(
			"./src/emails/comments/replyComments.email.ejs",
			{
				comment: newComment,
			}
		);

		// Send an email to the author of the parent comment
		await sendMail({
			to: "tuananhngo2513@gmail.com",
			subject: `${req.user.name} has replied to your comment`,
			html,
		});

		return res
			.status(201)
			.json({ newComment, message: "Comment added successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = { getCommentsByAr, addComment, replyComment };
