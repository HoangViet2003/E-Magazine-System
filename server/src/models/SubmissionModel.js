const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		contributionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Contribution",
			required: true,
		},
		isSelectedForPublication: {
			type: Boolean,
			default: false,
		},
		isFavorite: {
			type: Boolean,
			default: false,
		},
		unsubmitted: {
			type: Boolean,
			default: true,
		},
		articles: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Article",
			default: [],
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
)

//populate user
submissionSchema.pre(/^find/, function (next) {
	this.populate({
		path: "student",
		select: "name email",
	})

	next()
})

submissionSchema.pre(/^find/, function (next) {
	this.populate({
		path: "contributionId",
		select: "academicYear",
	})

	next()
})

const Submission = mongoose.model("Submission", submissionSchema)

module.exports = Submission
