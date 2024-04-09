const mongoose = require("mongoose")

const facultySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		marketingCoordinatorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			unique: true,
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
)

const Faculty = mongoose.model("Faculty", facultySchema)

module.exports = Faculty
