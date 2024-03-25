const { Submission } = require("../models");

const createSubmission = async (req, res) => {
	try {
		const { contributionId } = req.body;
        const user = req.user._id;
		const submission = await Submission.create({ user, contributionId });
		res.status(201).json({ submission });
	} catch (error) {
		res.status(400).json({ error });
	}
};

//get all submissions
const getAllSubmissions = async (req, res) => {
	try {
		const submissions = await Submission.find();
		res.status(200).json({ submissions });
	} catch (error) {
		res.status(400).json({ error });
	}
};

const getAllSubmissionByContributionId = async (req, res) => {
	try {
		const { contributionId } = req.params;
		const submissions = await Submission.find({ contributionId });

		if(!submissions && !contributionId) {
			return res.status(404).json({ message: "No submissions found for the contribution" });
		}

		res.status(200).json({ submissions });
	} catch (error) {
		res.status(400).json({ error });
	}
}

//get submission by student id 
const getSubmissionByStudentId = async (req, res) => {
	try {
		const student = req.user;
		const submission = await Submission.findOne({ user: student._id });

		if(!submission) {

			return res.status(404).json({ message: "No submission found for the student" });
		
		}

		res.status(200).json({ submission });

	} catch (error) {
		res.status(400).json({ error });
	}
}

module.exports = {
	createSubmission,
	getAllSubmissions,
	getAllSubmissionByContributionId,
	getSubmissionByStudentId
};
