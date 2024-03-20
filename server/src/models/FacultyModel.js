const mongoose = require("mongoose");
const Joi = require('joi'); 

const facultySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
	
		marketingCoordinatorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt
	}
);

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
