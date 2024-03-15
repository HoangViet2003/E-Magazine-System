const {Contribution} = require('../models');

const createContribution = async (req, res) => {
	try {
		const {
			facultyId,
			studentId,
			title,
			status,
		
		} = req.body;

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

module.exports = {
    createContribution,
    getAllContributions
}