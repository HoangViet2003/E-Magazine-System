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
const sendMail = require("../utils/sendMail");
const emitterInstance = EmitterSingleton.getInstance();
const emitter = emitterInstance.getEmitter();

const uploadArticle = async (req, res) => {
	try {
		const { contributionId, type } = req.body;
		const student = req.user;

		if (!student) {
			return res.status(404).json({ error: "Student does not exist" });
		}

		if (!req.files || req.files.length === 0) {
			return res.status(400).json({
				status: "error",
				message: "No file uploaded",
			});
		}

		const uploadPromises = req.files.map(async (file) => {
			if (type === "word") {
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
					type: "word",
				};
			} else if (type === "image") {
				try {
					await uploadFiles(file, "article/");
					await fs.promises.unlink(file.path);

					if (!file.mimetype.startsWith("image")) {
						throw new Error("Please upload only image files");
					}

					return `https://magazine-images-upload.s3.ap-southeast-1.amazonaws.com/article/${file.originalname}`;
				} catch (error) {
					return null;
				}
			} else {
				throw new Error("Invalid Type");
			}
		});

		const uploadResults = await Promise.allSettled(uploadPromises);

		const articles = [];
		const images = [];

		uploadResults.forEach((result) => {
			if (result.status === "fulfilled") {
				const value = result.value;
				if (typeof value === "string") {
					images.push(value);
				} else if (typeof value === "object") {
					articles.push(value);
				}
			}
		});

		if (type === "word") {
			await fs.promises.unlink(req.files[0].path); // Assuming one file for "word"
		}

		let newArticles;
		if (articles.length > 0) {
			newArticles = await Article.create(articles);
		}

		// Send email to marketing coordinator
		await sendEmail(student.name);

		return res.status(201).send({
			status: "success",
			message: "Article(s) uploaded successfully",
			articles: newArticles,
			images: images,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//getAll article by studentId
const getAllArticleByStudentId = async (req, res) => {
	try {
		// return result
		const student = req.user;
		if (!student._id) {
			return res
				.status(404)
				.json({ status: "error", error: "Student does not exist" });
		}

		const page = parseInt(req.query.page) || 1;
		const limit = 5;
		const skip = (page - 1) * limit;

		const articles = await Article.find({
			studentId: student._id,
		})
			.skip(skip)
			.limit(limit)
			.populate("studentId", "name"); // Populate the studentId field with name

		const totalLength = Article.find({
			studentId: student._id,
		}).countDocuments();

		res.status(200).json({
			status: "success",
			articles,
			currentPage: page,
			totalPage: Math.ceil(totalLength / limit),
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//get article by id
const getArticleById = async (req, res) => {
	try {
		//check user have permission to get their article
		//if not return 403 error
		const { id } = req.params;

		const user = req.user;
		const article = await Article.findById(id);

		if (user.role === "student") {
			if (article.studentId.toString() != user._id.toString()) {
				return res
					.status(403)
					.json({ error: "You are not allowed to perform this action" });
			}
		} else if (user.role === "marketing coordinator") {
			const contribution = await Contribution.findOne(article.contributionId);
			const faculty = await Faculty.findOne(contribution.facultyId);
			if (faculty.marketingCoordinatorId.toString() != user._id.toString()) {
				return res
					.status(403)
					.json({ error: "You are not allowed to perform this action" });
			}
		}

		if (!article) {
			return res
				.status(404)
				.json({ status: "error", error: "Article not found" });
		}
		res.status(200).json({ status: "success", article });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//get All article by contributionId
const getAllArticleByContributionId = async (req, res) => {
	try {
		const { contributionId } = req.params;
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
			.sort({ studentId: 1 })
			.skip(skip)
			.limit(limit);

		const totalLength = Article.find({
			contributionId: contributionId,
		}).countDocuments();

		res.status(200).json({
			status: "success",
			articles,
			currentPage: page,
			totalPage: Math.ceil(totalLength / limit),
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//delete article by id
const deleteArticle = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		const article = await Article.findById(id);

		if (user.role === "student") {
			if (article.studentId.toString() != user._id.toString()) {
				return res
					.status(403)
					.json({ error: "You are not allowed to perform this action" });
			}
		}
		if (!article) {
			return res
				.status(404)
				.json({ status: "error", error: "Article not found" });
		}

		await Article.findByIdAndDelete(id);

		res.status(200).json({ status: "success", message: "Article deleted" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateArticlesForPublication = async (req, res) => {
	try {
		const { articleIds } = req.body;
		const user = req.user;

		//check if articleIds is empty
		if (!articleIds) {
			return res.status(400).json({
				status: "error",
				message: "Article IDs are required",
			});
		}

		//check marketing coordinator is the marketing coordinator of the faculty
		const marketingCoordinatorId = user._id;
		const faculty = await Faculty.findOne({ marketingCoordinatorId });
		if (!faculty) {
			return res.status(403).json({
				error: "You are not the marketing coordinator of any faculty",
			});
		}

		const contribution = await Contribution.findOne({ facultyId: faculty._id });

		const articles = await Article.find({ _id: { $in: articleIds } });
		articles.forEach((article) => {
			if (article.contributionId.toString() != contribution._id.toString()) {
				return res.status(403).json({
					error: "You are not the marketing coordinator of this faculty",
				});
			}
		});

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
		const user = req.user;

		//check if articleId is empty
		if (!articleId) {
			return res.status(400).json({
				status: "error",
				message: "Article ID is required",
			});
		}

		// check if the marketing coordinator is the marketing coordinator of the current falculty
		const marketingCoordinatorId = user._id;

		const contribution = await Contribution.findOne({
			facultyId: marketingCoordinatorId,
		});

		// check if contribution falculty id is the same as the marketing coordinator id's faculty id
		if (
			contribution.facultyId.toString() != marketingCoordinatorId.toString()
		) {
			return res.status(403).json({
				error: "You are not the marketing coordinator of this faculty",
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
};

//search article by title,student name
const searchArticle = async (req, res) => {
	try {
		const { query, contributionId } = req.query;
		const page = parseInt(req.query.page) || 1;
		const limit = 5;
		const skip = (page - 1) * limit;

		// Constructing the match query for aggregation
		const matchQuery = {
			$or: [{ title: { $regex: new RegExp(query, "i") } }, { contributionId }],
		};

		const [articles, totalLength] = await Promise.all([
			Article.aggregate([
				{ $match: matchQuery },
				{ $skip: skip },
				{ $limit: limit },
			]),
			Article.aggregate([{ $match: matchQuery }, { $count: "total" }]),
		]);

		// Extracting the total count from the result
		const totalCount = totalLength.length > 0 ? totalLength[0].total : 0;

		res.status(200).json({
			status: "success",
			articles,
			currentPage: page,
			totalPage: Math.ceil(totalCount / limit),
			totalLength: totalCount,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const filterArticle = async (req, res) => {
	try {
		const {
			contributionId,
			type,
			isFavorite,
			isSelectedForPublication,
			title,
		} = req.query;
		const page = parseInt(req.query.page) || 1;

		const limit = 5;
		const skip = (page - 1) * limit;

		const searchRegex = new RegExp(title, "i");

		// Constructing the match query for aggregation
		const matchQuery = {
			title,
			contributionId,
			type,
			isFavorite,
			isSelectedForPublication,
		};

		// Using a single aggregation pipeline for fetching articles and getting total count
		const [articles, totalLength] = await Promise.all([
			Article.aggregate([
				{ $match: matchQuery },
				{ $skip: skip },
				{ $limit: limit },
			]),
			Article.aggregate([{ $match: matchQuery }, { $count: "total" }]),
		]);

		if (articles.length === 0) {
			return res
				.status(404)
				.json({ status: "error", message: "No articles found" });
		}

		// Extracting the total count from the result

		res.status(200).json({
			status: "success",
			articles,
			currentPage: page,
			totalPage: Math.ceil(totalCount / limit),
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//donwload all article selected as zip file
const downloadAllArticleSelected = async (req, res) => {
	try {
		const { articleIds } = req.body;
		const articles = await Article.find({ _id: { $in: articleIds } });

		const files = articles.map((article) => {
			if (article.type === "word") {
				return {
					filename: article.title,
					content: article.content,
				};
			} else {
				return {
					filename: article.title,
					content: article.content,
				};
			}
		});

		const zip = new require("node-zip")();
		files.forEach((file) => {
			zip.file(file.filename, file.content);
		});

		const data = zip.generate({ base64: false, compression: "DEFLATE" });

		res.status(200).json({
			status: "success",
			data,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const sendEmail = async (studentName) => {
	const emailTemplatePath = path.join(
		__dirname,
		"..",
		"emails",
		"notification.email.ejs"
	);
	const templateData = { studentName };

	ejs.renderFile(emailTemplatePath, templateData, async (err, html) => {
		if (err) {
			console.error("Error rendering email template:", err);
			return;
		}

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
};

module.exports = {
	uploadArticle,
	getAllArticleByStudentId,
	getArticleById,
	getAllArticleByContributionId,
	updateArticlesForPublication,
	updateArticleFavorite,
	searchArticle,
	filterArticle,
	downloadAllArticleSelected,
	deleteArticle,
};
