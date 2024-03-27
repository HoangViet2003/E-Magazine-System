const { Submission } = require("../models");
const { handleSendEmail } = require("../utils/sendMail");
const { emitNotification } = require("../utils/initSocket");

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

		if (!submissions && !contributionId) {
			return res
				.status(404)
				.json({ message: "No submissions found for the contribution" });
		}

		res.status(200).json({ submissions });
	} catch (error) {
		res.status(400).json({ error });
	}
};

//get submission by student id
const getSubmissionByStudentId = async (req, res) => {
	try {
		const student = req.user;
		const submission = await Submission.findOne({ user: student._id });

		if (!submission) {
			return res
				.status(404)
				.json({ message: "No submission found for the student" });
		}

		res.status(200).json({ submission });
	} catch (error) {
		res.status(400).json({ error });
	}
};

const updateForPublication = async (req, res) => {
	try {
		const { submissionIds } = req.body;
		const user = req.user;

		//check if articleIds is empty
		if (!submissionIds) {
			return res.status(400).json({
				status: "error",
				message: "Article IDs are required",
			});
		}

		// check marketing coordinator is the marketing coordinator of the faculty

		// Update articles with the given IDs to set isSelectedForPublication to true
		const updatedSubmission = await Submission.updateMany(
			{ _id: { $in: submissionIds } },
			{ $set: { isSelectedForPublication: true } },
			{ new: true } // To get the updated documents back
		);

		return res.status(200).json({
			updatedSubmission,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const updateFavorite = async (req, res) => {
	try {
		const { submissionIds } = req.body;
		const user = req.user;

		//check if articleIds is empty
		if (!submissionIds) {
			return res.status(400).json({
				status: "error",
				message: "Article IDs are required",
			});
		}

		// check marketing coordinator is the marketing coordinator of the faculty

		// Update articles with the given IDs to set isSelectedForPublication to true
		const updatedSubmission = await Submission.updateMany(
			{ _id: { $in: submissionIds } },
			{ $set: { isFavorite: true } },
			{ new: true } // To get the updated documents back
		);

		return res.status(200).json({
			updatedSubmission,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const addCommentSubmission = async (req, res) => {
	try {
		const { submissionId } = req.params;
		const { comment } = req.body;

		const submission = await Submission.findById(submissionId);

		if (!submission) {
			return res.status(404).json({ message: "Submission not found" });
		}

		submission.comment = comment;
		submission.isCommented = true;
		await submission.save();

		// Send email to student
		const student = submission.user;
		// handleSendEmail(
		// 	student.email,
		// 	"Submission Comment",
		// 	`Your submission has been commented on. Please check your submission for more details`
		// );

		console.log("Student", student._id);

		// Emit notification to student
		emitNotification(student._id.toString(), "Your submission has been commented on");

		res.status(200).json({ message:"Add comment to submission successfully",submission });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	createSubmission,
	getAllSubmissions,
	getAllSubmissionByContributionId,
	getSubmissionByStudentId,
	updateForPublication,
	updateFavorite,
	addCommentSubmission
};
