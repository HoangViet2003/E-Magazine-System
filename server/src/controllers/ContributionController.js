const {Contribution,Article,Faculty} = require('../models');
const { catchAsync } = require("../utils");


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

const getAllContributionByMarketingCoordinator = catchAsync(async (req, res) => {
	try{
		const {facultyId} = req.body;

		//check if faculty exists and falcutyId is valid

		const marketingCoordinator = req.user;
		const faculty = await Faculty.findOne({_id: faculty});
		if(!faculty){
			return res.status(400).json({error: "Faculty does not exist"});
		}

		//check marketing coordinator is the marketing coordinator of the faculty
		if(faculty.marketingCoordinatorId !== marketingCoordinator._id){
			return res.status(403).json({error: "You are not the marketing coordinator of this faculty"});
		}

		
		const contributions = await Contribution.find({facultyId: facultyId});



		res.status(200).json({
			status: "success",
			contributions,
		});
	}catch(error){
		res.status(500).json({ error: error.message });
	}
});




module.exports = {
    createContribution,
    getAllContributions
}