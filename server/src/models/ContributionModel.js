const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
	{
		facultyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Faculty",
			required: true,
		},
		submissions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Submission",
				required: true,
			},
		],
		status: {
			type: String,
			enum: ["open", "closed"],
			required: true,
		},
		academicYear: {
			type: string,
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
contributionSchema.pre(/^find/, function (next) {
	this.populate({
		path: "submissions",
		select: "user isCommented",
	});

	next();
});

const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;
