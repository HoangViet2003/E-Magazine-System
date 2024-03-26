const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
	{
		facultyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Faculty",
			required: true,
		},
		status: {
			type: String,
			enum: ["open", "closed"],
			required: true,
		},
		academicYear: {
			type: String,
			required: true,
		},
		closureDate: {
			type: Date,
			required: true,
		},
		finalClosureDate: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
);

//populate submissions


const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;
