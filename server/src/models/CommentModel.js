const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		articleId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Article",
			required: true,
		},
		staffId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Staff",
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
