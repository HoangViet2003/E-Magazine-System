const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const {
	uploadFiles,
	deleteFiles,
	getFileStream,
} = require("../services/fileS3.services");
const mammoth = require("mammoth");
const { Article, Contribution, History, User, Faculty } = require("../models");
const EmitterSingleton = require("../configs/eventEmitter");
const { gmail } = require("googleapis/build/src/apis/gmail");
const sendMail = require("../utils/sendMail");
const emitterInstance = EmitterSingleton.getInstance();
const emitter = emitterInstance.getEmitter();

const uploadArticle = async (req, res) => {
	try {
		const { contributionId, type } = req.body;
		const student = req.user;

		// Check if student exists
		if (!student) {
			return res.status(404).json({ error: "Student does not exist" });
		}

		if (!req.files || req.files.length === 0) {
			return res.status(400).json({
				status: "error",
				message: "No file uploaded",
			});
		}

		// Check if contribution exists
		if (type === "word") {
			const articlePromises = req.files.map(async (file) => {
				if (
					file.mimetype !==
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
				) {
					throw new Error("Please upload Word documents (.docx)");
				}

				const filePath = file.path;
				const result = await mammoth.convertToHtml({ path: filePath });
				const html = result.value; // The generated HTML

				return {
					contributionId: contributionId,
					studentId: student._id,
					title: file.originalname,
					content: html,
					type: type,
				};
			});

			const newArticles = await Promise.all(articlePromises);
			await fs.promises.unlink(req.files[0].path); // Assuming one file for "word"

			// Save the updated contribution
			const createdArticles = await Article.create(newArticles);

			return res.status(201).send({
				status: "success",
				message: "Article(s) uploaded successfully",
				articles: createdArticles,
			});

			// Save the updated contribution
		} else if (type === "image") {
			// If Type is "image" and images are uploaded
			const uploadPromises = req.files.map(async (file) => {
				try {
					await uploadFiles(file, "article/");
					await fs.promises.unlink(file.path);

					if (!file.mimetype.startsWith("image")) {
						// Invalid file type for "image"
						throw new Error("Please upload only image files");
					}

					return `https://magazine-images-upload.s3.ap-southeast-1.amazonaws.com/article/${file.originalname}`;
				} catch (error) {
					return null;
				}
			});

			const uploadResults = await Promise.allSettled(uploadPromises);

			const images = uploadResults
				.filter((result) => result.status === "fulfilled")
				.map((result) => result.value);

			const newArticle = await Article.create({
				contributionId: contributionId,
				studentId: student._id,
				type,
				content: images,
				title: req.files[0].originalname,
			});

			//add to contribution.content

			//TODO: Delete the files from the server
			// await req.files.forEach(async (file) => {
			// 	await fs.promises.unlink(file.path);
			// });

			// TODO: Send email to marketing coordinator

			//find marketing coordinator
			const marketingCoordinator = await User.findOne({
				role: "marketing coordinator",
				facultyId: student.facultyId,
			});

			//send email to marketing coordinator

			// await ejs.renderFile(
			// 	path.join(__dirname, "..", "..", "emails", "accountConfirmation.ejs"),
			// 	{ url },
			// 	async (err, html) => {
			// 		if (err) throw err;
			// 		await sendMail({
			// 			bcc: req.body.email,
			// 			subject: "Đặt lại mật khẩu (App liên đoàn luật sư)",
			// 			html,
			// 		});
			// 	}
			// );

			const emailTemplatePath = path.join(
				__dirname,
				"..",
				"emails",
				"notification.email.ejs"
			);

			const templateData = { studentName: student.name };

			ejs.renderFile(emailTemplatePath, templateData, async (err, html) => {
				if (err) {
					console.error("Error rendering email template:", err);
					return res
						.status(500)
						.json({ error: "Error rendering email template" });
				}

				// Send email to marketing coordinator
				try {
					await sendMail({
						to: "zeusson3@gmail.com",
						subject: "New Article Uploaded",
						html,
					});

					console.log("Email sent to marketing coordinator");
				} catch (error) {
					console.error("Error sending email to marketing coordinator:", error);
				}
			});

			// TODO : Send email to student

			// TODO: Create history for contribution
			// const history = await History.create({
			// 	contributionId: contributionId,
			// 	action: "create",
			// 	userId: student._id,
			// });

			// TODO: Create notification for admin
			// emitter.emit("notifyMarketingCoordinator", {
			// 	facultyId: student.facultyId,
			// 	message: `${student.name} has uploaded an article. Please review it.`,
			// });

			return res.status(201).send({
				status: "success",
				message: "Article uploaded successfully",
				newArticle,
			});
		} else {
			return res.status(400).send({
				status: "error",
				message: "Invalid Type or Missing File",
			});
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//getAll article by studentId
const getAllArticleByStudentId = async (req, res) => {
	try {
		const { contributionId } = req.body;
		const studentId = req.user._id;
		if (!studentId) {
			return res
				.status(404)
				.json({ status: "fail", error: "Student does not exist" });
		}

		const page = parseInt(req.query.page) || 1;
		const limit = 5;
		const skip = (page - 1) * limit;
		const articles = await Article.find({
			studentId: studentId,
			contributionId: contributionId,
		})
			.skip(skip)
			.limit(limit);

		const totalLength = await Article.find({
			studentId: studentId,
			contributionId: contributionId,
		}).countDocuments();

		res.status(200).json({
			status: "success",
			articles,
			currentPage: page,
			totalPage: Math.ceil(totalLength / limit),
			totalLength: totalLength,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//get All article by contributionId
const getAllArticleByContributionId = async (req, res) => {
	try {
		const { contributionId } = req.body;
		const marketingCoordinatorId = req.user._id;

		//check marketing coordinator is the marketing coordinator of the faculty
		const contribution = await Contribution.findById(contributionId);
		const faculty = await Faculty.findById(contribution.facultyId);
		if (marketingCoordinatorId != faculty.marketingCoordinatorId.toString()) {
			return res.status(403).json({
				error: "You are not the marketing coordinator of this faculty",
			});
		}

		const page = parseInt(req.query.page) || 1;
		const limit = 5;
		const skip = (page - 1) * limit;
		const articles = await Article.find({ contributionId: contributionId })
			.sort({ 'studentId': 1 })
			.skip(skip)
			.limit(limit);

		const totalLength = await Article.find({
			contributionId: contributionId,
		}).countDocuments();

		res.status(200).json({
			status: "success",
			articles,
			currentPage: page,
			totalPage: Math.ceil(totalLength / limit),
			totalLength: totalLength,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateArticlesForPublication = async (req, res) => {
	try {
		const { articleIds } = req.body;

		//check if articleIds is empty
		if (!articleIds) {
			return res.status(400).json({
				status: "fail",
				message: "Article IDs are required",
			});
		}

		//check marketing coordinator is the marketing coordinator of the faculty
		


		// Update articles with the given IDs to set isSelectedForPublication to true
		const updatedArticles = await Article.updateMany(
			{ _id: { $in: articleIds } },
			{ $set: { isSelectedForPublication: true } },
			{ new: true } // To get the updated documents back
		);

		res.status(200).json({
			status: "success",
			updatedArticles,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateArticleFavorite = async (req, res) => {
	try {
		const { articleId } = req.body;

		//check if articleId is empty
		if (!articleId) {
			return res.status(400).json({
				status: "fail",
				message: "Article ID is required",
			});
		}

		// Update article with the given ID to set isFavorite to true
		const updatedArticle = await Article.findByIdAndUpdate(
			articleId,
			{ $set: { isFavorite: true } },
			{ new: true } // To get the updated document back
		);

		res.status(200).json({
			status: "success",
			updatedArticle,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}

}

module.exports = {
	uploadArticle,
	getAllArticleByStudentId,
	getAllArticleByContributionId,
	updateArticlesForPublication,
	updateArticleFavorite
};
