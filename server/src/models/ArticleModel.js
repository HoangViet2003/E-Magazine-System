const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
	{
		contributionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Contribution",
			required: true,
		},
		studentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Student",
			required: true,
		},
		content: {
			type: Array, // Store as TEXT or VARCHAR
			required: true,
			
		},
		type: {
			type: String,
			enum: ["word", "image"],
			required: true,
		},
		isSelectedForPublication: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
