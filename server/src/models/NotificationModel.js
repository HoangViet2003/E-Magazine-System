const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		isRead: {
			type: Boolean,
			default: false,
		},
		doer: {
			type: mongoose.Schema.Types.ObjectId, // Assuming the doer is a user in the system
			ref: "User", // Reference to the User model
			required: true,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId, // Assuming the receiver is a user in the system
			ref: "User", // Reference to the User model
			required: true,
		},
		actionUrl: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
)

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification
