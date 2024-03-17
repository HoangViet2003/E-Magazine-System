const { Contribution, Article, Faculty } = require("../models");
const { catchAsync } = require("../utils");

const createContribution = async (req, res) => {
	try {
		const { facultyId, studentId, title, status } = req.body;

		const uploadDate = new Date();
		const academicYear = new Date();
		const closureDate = new Date();

		const newContribution = new Contribution({
			facultyId,
			studentId,
			title,
			uploadDate,
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
		const page = parseInt(req.query.page) || 1; 
		const limit = 10;
		const skip = (page - 1) * limit;

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
			.skip(skip)
			.limit(limit);
		const totalLength = contributions.length;

		res.status(200).json({
			status: "success",
			contributions,
			currentPage: page,
			totalPage: Math.ceil(totalLength / limit),
			totalLength: totalLength,
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
