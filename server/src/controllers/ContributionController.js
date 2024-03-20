const { catchAsync } = require("../utils");
const fs = require("fs");
const {
	uploadFiles,
	deleteFiles,
	getFileStream,
} = require("../services/fileS3.services");
const mammoth = require("mammoth");
const { Article, Contribution, History, User,Faculty } = require("../models");
const EmitterSingleton = require("../configs/eventEmitter");

const emitterInstance = EmitterSingleton.getInstance();
const emitter = emitterInstance.getEmitter();


const createContribution = async (req, res) => {
	try {
		const { facultyId, status } = req.body;

		const academicYear = new Date();
		const closureDate = new Date();

		const newContribution = new Contribution({
			facultyId,
			status,
			academicYear,
			closureDate,
		});

		await newContribution.save();

		res.status(201).json({
			status: "success",
			data: newContribution,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getAllContributions = async (req, res) => {
	try {
		const contributions = await Contribution.find();
		res.status(200).json({
			status: "success",
			data: contributions,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getAllContributionByFaculty = catchAsync(async (req, res) => {
	try {
		const { facultyId } = req.body;
	

		if (!facultyId) {
			return res.status(400).json({
				status: "fail",
				message: "Faculty ID is required",
			});
		}

		const userId = req.user._id;
		const faculty = await Faculty.findById(facultyId);
		const marketingCoordinatorId = faculty.marketingCoordinatorId.toString();

		if (!faculty) {
			return res.status(400).json({ error: "Faculty does not exist" });
		}

		//check marketing coordinator is the marketing coordinator of the faculty
		if (marketingCoordinatorId != userId) {
			return res.status(403).json({
				error: "You are not the marketing coordinator of this faculty",
			});
		}

		const contributions = await Contribution.find({ facultyId: facultyId })
			

		res.status(200).json({
			status: "success",
			contributions,
		
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});



module.exports = {
	createContribution,
	getAllContributions,
	getAllContributionByFaculty,
};
