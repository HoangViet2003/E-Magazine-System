const mongoose = require("mongoose")
const validator = require("validator")

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
			validate: {
				validator: function (value) {
					// Check if the email format is valid
					return validator.isEmail(value)
				},
				message: "Invalid email format.",
			},
		},
		password: {
			type: String,
			required: true,
			validate: {
				validator: function (value) {
					// Password must be at least 8 characters long, contain at least one uppercase letter,
					// one number, and one special character
					return (
						validator.isStrongPassword(value, {
							minLength: 8,
							minLowercase: 0,
							minUppercase: 1,
							minNumbers: 1,
							minSymbols: 1,
						}) && !/\s/.test(value) // No whitespace allowed
					)
				},
				message:
					"Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.",
			},
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
)

const User = mongoose.model("User", userSchema)

module.exports = User
