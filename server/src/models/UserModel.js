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
				"administrator",
				"marketing manager",
				"marketing coordinator",
				"student",
				"guest",
			],
			required: true,
		},
		facultyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Faculty",
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
