const mongoose = require("mongoose")

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
)

// Define pre-remove middleware to delete associated submissions
contributionSchema.pre("remove", async function (next) {
	try {
		// Remove all submissions associated with this contribution
		await Submission.deleteMany({ contributionId: this._id })
		next()
	} catch (error) {
		next(error)
	}
})

const Contribution = mongoose.model("Contribution", contributionSchema)

module.exports = Contribution
