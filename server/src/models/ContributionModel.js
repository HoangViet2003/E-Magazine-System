const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
	{
		facultyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Faculty",
			required: true,
		},
		studentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		uploadDate: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
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
