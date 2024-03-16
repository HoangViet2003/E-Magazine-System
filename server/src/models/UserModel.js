const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: [
				"marketing manager",
				"marketing coordinator",
				"administrator",
				"student",
				"guest",
			],
			required: true,
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
