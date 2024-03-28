const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema(
	{
		contributionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Contribution",
			required: true,
		},
		submissionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Submission",
		},
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		content: {
			type: Array, // Store as TEXT or VARCHAR
			required: true,
			default: [],
		},
		type: {
			type: String,
			enum: ["word", "image"],
			required: true,
		},
		status: {
			type: String,
			enum: ["draft", "submitted", "selected"],
			required: true,
			default: "draft",
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
)

//poulate user
articleSchema.pre(/^find/, function (next) {
	this.populate({
		path: "student",
		select: "name email facultyId",
	})
	next()
})

const Article = mongoose.model("Article", articleSchema)

module.exports = Article
