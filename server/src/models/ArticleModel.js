const mongoose = require("mongoose");

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
			required: true,
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
		facultyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Faculty",
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
		}
	
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
);

//poulate user
articleSchema.pre(/^find/, function (next) {
	this.populate({
		path: "student",
		select: "name email facultyId",
	});
	next();
});


const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
