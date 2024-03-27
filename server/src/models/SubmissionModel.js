const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		contributionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Contribution",
			required: true,
		},
		comment:{
			type: String,
			default: null
		},
		isCommented: {
			type: Boolean,
			default: false,
		},
		isSelectedForPublication: {
			type: Boolean,
			default: false,
		},
		isFavorite: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
);

//populate user 
submissionSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name email",
    });

    next();
});

submissionSchema.pre(/^find/, function (next) {
	this.populate({
		path: "contributionId",
		select: "academicYear",
	});

	next();
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
