const mongoose = require("mongoose");
const Article = require("./ArticleModel");

const contributionSchema = new mongoose.Schema(
	{
		facultyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Faculty",
			required: true,
		},
		status:{
			type: String,
			enum: ["open", "closed"],
			required: true,
		},
		academicYear: {
			type: Date,
			required: true,
		},
		closureDate: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
);

const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;
