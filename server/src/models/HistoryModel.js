const mongoose = require("mongoose")

const historySchema = new mongoose.Schema(
	{
		submissionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Submission",
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		action: {
			type: String,
			enum: ["create", "update", "delete", "submit", "comment", "reply"],
			required: true,
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
)

const History = mongoose.model("History", historySchema)

module.exports = History
