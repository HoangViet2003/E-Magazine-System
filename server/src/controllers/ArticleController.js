const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const {
	uploadFiles,
	deleteFiles,
	getFileStream,
} = require("../services/fileS3.services");
const mammoth = require("mammoth");
const {
	Article,
	Contribution,
	History,
	User,
	Faculty,
	Comment,
	Submission,
	Notification,
} = require("../models");
const { handleSendEmail } = require("../utils/sendMail");
const { emitNotification } = require("../utils/initSocket");
const EmitterSingleton = require("../configs/eventEmitter");
const emitterInstance = EmitterSingleton.getInstance();
const emitter = emitterInstance.getEmitter();

const uploadArticle = async (req, res) => {
	try {
		const { type } = req.body;
		const student = req.user;

		if (!req.files || req.files.length === 0) {
			return res.status(400).json({
				status: "error",
				message: "No file uploaded",
			});
		}
		const submission = await Submission.findOne({ user: student._id });
		let article;

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
					submissionId: submission._id,
					student: student._id,
					title: file.originalname,
					content: html,
					type: type,
					facultyId: student.facultyId,
					contributionId: submission.contributionId._id,
				};
			});

			const newArticles = await Promise.all(articlePromises);
			await fs.promises.unlink(req.files[0].path); // Assuming one file for "word"

			// Save the updated contribution
			article = await Article.create(newArticles);

			// return res.status(201).send({
			// 	status: "success",
			// 	message: "Article(s) uploaded successfully",
			// 	articles: createdArticles,
			// });

			// Save the updated contribution
		} else if (type === "image") {
			// If Type is "image" and images are uploaded
			const uploadPromises = req.files.map(async (file) => {
				try {
					await uploadFiles(file, "articles/");
					await fs.promises.unlink(file.path);
					console.log(file.path);

					if (!file.mimetype.startsWith("image")) {
						// Invalid file type for "image"
						throw new Error("Please upload only image files");
					}

					return `https://magazine-images-upload.s3.ap-southeast-1.amazonaws.com/articles/${file.originalname}`;
				} catch (error) {
					return null;
				}
			});

			const uploadResults = await Promise.allSettled(uploadPromises);

			const images = uploadResults
				.filter((result) => result.status === "fulfilled")
				.map((result) => result.value);

			article = await Article.create({
				submissionId: submission._id,
				student: student._id,
				type,
				content: images,
				title: student.name + "'s images",
				facultyId: student.facultyId,
				contributionId: submission.contributionId._id,
			});
		} else {
			return res.status(400).send({
				status: "error",
				message: "Invalid Type or Missing File",
			});
		}

		const history = await History.create({
			submissionId: submission._id,
			action: "create",
			userId: student._id,
		});

		//TODO: Delete the files from the server
		// await req.files.forEach(async (file) => {
		// 	await fs.promises.unlink(file.path);
		// });

		// TODO: Send email to student to confirm the upload
		handleSendEmail(student.name, student.email, "Article Uploaded");

		//find marketing coordinator
		const marketingCoordinator = await User.findOne({
			role: "marketing coordinator",
			facultyId: student.facultyId,
		});

		//send email to marketing coordinator

		handleSendEmail(
			marketingCoordinator.name,
			marketingCoordinator.email,
			"New Article Uploaded"
		);

		emitNotification(
			marketingCoordinator._id.toString(),
			`New Article Uploaded by ${student.name}, please review it`
		);
		await Notification.create({
			userId: marketingCoordinator._id,
			message: `New Article Uploaded by ${student.name}, please review it`,
		});

		return res.status(201).send({
			message: "Article uploaded successfully",
			article,
			history,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateArticle = async (req, res) => {
	const { articleId } = req.params;
	const { content, type, title } = req.body;
	const { files } = req;

	try {
		const article = await Article.findById(articleId);

		if (!article && !type) {
			throw new Error("Article does not exist or invalid type");
		}

		article.title = title;

		if (type === "word" && files.length > 0) {
			//update content in article to new content
			article.content[0] = content;
		}

		if (files && files.length > 0 && type === "image") {
			const uploadPromises = files.map(async (file) => {
				// Assuming uploadFiles and deleteFiles functions are defined
				// Upload new images
				await uploadFiles(file, "articles/");
				await fs.promises.unlink(file.path);
				return `https://magazine-images-upload.s3.ap-southeast-1.amazonaws.com/articles/${file.originalname}`;
			});

			const uploadedImages = await Promise.all(uploadPromises);

			const imagesToDelete = content
				? article.content.filter((image) => !content.includes(image))
				: article.content;

			// Delete images not kept
			await deleteFiles(imagesToDelete, "articles/");

			// Update article images
			article.content = content
				? [...content, ...uploadedImages]
				: uploadedImages;
		} else if (content) {
			// Delete images not kept
			const imagesToDelete = article.content.filter(
				(image) => !content.includes(image)
			);
			await deleteFiles(imagesToDelete, "articles/");

			// Update article images
			article.content = content;
		}

		// Update other fields
		Object.keys(req.body).forEach((field) => {
			if (field !== "content" && field !== "images") {
				article[field] = req.body[field];
			}
		});

		// Save updated article
		await article.save();

		return res.send({
			status: "success",
			message: "Article updated successfully",
			article,
		});
	} catch (error) {
		return res.status(500).send({ status: "error", message: error.message });
	}
};

//create word file
const createBlankWordFile = async (req, res) => {
	try {
		const {submissionId} = req.body;
		const user = req.user;
		const article = await Article.create({
			submissionId: submissionId,
			title: "Blank Article",
			type: "word",
			student: user._id,
			facultyId: user.facultyId,
			contributionId:submission.contributionId._id



		});

		res.status(201).json({ article});
	} catch(err) {
		res.status(500).json({ error: err.message });
	}
};

//getAll article by studentId
const getAllArticlesByStudentId = async (req, res) => {
	try {
		// return result
		const student = req.user;

		const page = parseInt(req.query.page) || 1;
		const limit = 5;
		const skip = (page - 1) * limit;

		const articles = await Article.find({
			student: student._id,
		})
			.skip(skip)
			.limit(limit)
			

		const totalLength = await Article.find({
			student: student._id,
		}).countDocuments();

		res.status(200).json({
			articles,
			totalPage: Math.ceil(totalLength / limit),
			totalLength: totalLength,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//get all article by submissionId
const getAllArticlesBySubmissionId = async (req, res) => {
	try {
		const { submissionId } = req.params;
		const page = parseInt(req.query.page) || 1;
		const limit = 5;
		const skip = (page - 1) * limit;

		const articles = await Article.find({ submissionId })
			.skip(skip)
			.limit(limit);

		const totalLength = await Article.find({ submissionId }).countDocuments();

		res.status(200).json({
			articles,
			totalPage: Math.ceil(totalLength / limit),
			totalLength: totalLength,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//get article by id
const getArticleById = async (req, res) => {
	try {
		const { articleId } = req.params;
		const user = req.user;

		const article = await Article.findOne({ _id: articleId }).populate(
			"student",
			"name email facultyId"
		);

		if (!article) {
			return res
				.status(404)
				.json({ status: "error", error: "Article not found" });
		}

		// Check if user is a student and the article's student is not the current user
		if (
			user.role === "student" &&
			article.student._id.toString() !== user._id.toString()
		) {
			return res
				.status(403)
				.json({ error: "You are not allowed to perform this action" });
		}

		// Check if user's faculty matches the article's faculty
		if (article.facultyId.toString() !== user.facultyId.toString()) {
			return res
				.status(403)
				.json({ error: "You are not allowed to perform this action" });
		}

		res.status(200).json({ article });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//get All article by facultyId
const getAllArticlesByFacultyId = async (req, res) => {
	try {
		const facultyId = req.params.facultyId;
		const page = parseInt(req.query.page) || 1;
		const limit = 5;
		const skip = (page - 1) * limit;

		// Find articles for the faculty with pagination
		const articles = await Article.find({ facultyId: facultyId })
			.skip(skip)
			.limit(limit);

		// Count total number of articles for pagination
		const totalLength = await Article.countDocuments({ facultyId: facultyId });

		res.status(200).json({
			articles,
			totalPage: Math.ceil(totalLength / limit),
			
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//delete article by id
const deleteArticle = async (req, res) => {
	try {
		const { articleId } = req.params;
		const user = req.user;

		const article = await Article.findById(articleId);

		if (!article) {
			return res
				.status(404)
				.json({ status: "error", error: "Article not found" });
		}

		await Article.findByIdAndDelete(id);

		res.status(200).json({ message: "Article deleted" });
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

		// check marketing coordinator is the marketing coordinator of the faculty

		// Update articles with the given IDs to set isSelectedForPublication to true
		const updatedArticles = await Article.updateMany(
			{ _id: { $in: articleIds } },
			{ $set: { isSelectedForPublication: true } },
			{ new: true } // To get the updated documents back
		);

		return res.status(200).json({
			updatedArticles,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const updateArticleFavorite = async (req, res) => {
	try {
		const { articleIds } = req.body;
		const user = req.user;

		//check if articleId is empty
		if (!articleIds) {
			return res.status(400).json({
				message: "Article IDs array is required",
			});
		}

		// Update article with the given ID to set isFavorite to true
		const updatedArticles = await Article.updateMany(
			{ _id: { $in: articleIds } },
			{ $set: { isFavorite: true } },
			{ new: true } // To get the updated documents back
		);

		res.status(200).json({
			updatedArticles,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//search article by title,student name
const getSuggestionArticles = async (req, res) => {
	try {
		const { query } = req.query;
		const limit = 5;
		const user = req.user;

		const articles = await Article.find({
			title: { $regex: new RegExp(query, "i") },
			facultyId: user.facultyId, // Match facultyId of the user
		}).limit(limit);

		res.status(200).json({
			status: "success",
			articles,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const filterArticle = async (req, res) => {
	try {
		const { type, title } = req.query;
		const page = parseInt(req.query.page) || 1;
		const user = req.user;
		const limit = 5;
		const skip = (page - 1) * limit;

		let matchQuery = {
			facultyId: user.facultyId,
			type: type,
		};

		let articles;

		// Modify matchQuery for students
		if (user.role === "student") {
			matchQuery.student = user._id;
		}

		if (title) {
			matchQuery.title = { $regex: new RegExp(title, "i") };
		}

		articles = await Article.find(matchQuery).skip(skip).limit(limit);

		// Using a single aggregation pipeline for fetching articles and getting total count
		const totalLength = await Article.find(matchQuery).countDocuments();

		res.status(200).json({
			articles,
			totalPage: Math.ceil(totalLength / limit),
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

const getDashboard = async (req, res) => {
	try {
		// If the user role is student or guest, return 403
		if (req.user.role == "guest" || req.user.role == "student") {
			return res
				.status(403)
				.json({ error: "You are not allowed to perform this action" });
		}

		let { chosenRange } = req.query;

		// the chosenRange could be: "This week", "This month", "This year"
		let startDate = new Date();
		let endDate = new Date();

		if ((chosenRange = "This month")) {
			startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
			endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
		} else if ((chosenRange = "This year")) {
			startDate = new Date(startDate.getFullYear(), 0, 1);
			endDate = new Date(endDate.getFullYear(), 11, 31);
		} else {
			startDate = new Date(
				startDate.setDate(startDate.getDate() - startDate.getDay())
			);
			endDate = new Date(
				endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
			);
		}

		let query = {};

		// if the user role is marketing coordinator, only get the articles from the contribution of the faculty
		if (req.user.role == "marketing coordinator") {
			const faculty = await Faculty.findOne({
				marketingCoordinatorId: req.user._id,
			});

			const contribution = await Contribution.findOne({
				facultyId: faculty._id,
			});

			// add contributionId to the query
			query["contributionId"] = contribution._id;
		}

		const articles = await Article.find(query);

		const totalArticles = articles.length;

		// get the articles that are selected for publication
		const selectedArticles = articles.filter(
			(article) => article.isSelectedForPublication
		);
		const totalSelectedArticles = selectedArticles.length;

		// get the total number of contributors
		const contributors = new Set();
		articles.forEach((article) => {
			contributors.add(article.studentId);
		});
		const totalContributors = contributors.size;

		// Get the total number of comments
		const comments = await Comment.find({
			articleId: { $in: articles.map((article) => article._id) },
		});

		const totalComments = comments.length;

		// Get the total of articles that have comments and do not have comments
		const articlesWithComments = new Set();
		comments.forEach((comment) => {
			articlesWithComments.add(comment.articleId);
		});
		const totalArticlesWithComments = articlesWithComments.size;

		const totalArticlesWithoutComments =
			totalArticles - totalArticlesWithComments;

		return res.status(200).json({
			totalArticles,
			totalSelectedArticles,
			totalContributors,
			totalComments,
			totalArticlesWithComments,
			totalArticlesWithoutComments,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.message });
	}
};

module.exports = {
	uploadArticle,
	updateArticle,
	getAllArticlesByStudentId,
	getArticleById,
	getAllArticlesByFacultyId,
	updateArticlesForPublication,
	updateArticleFavorite,
	getSuggestionArticles,
	filterArticle,
	downloadAllArticleSelected,
	deleteArticle,
	getDashboard,
	getAllArticlesBySubmissionId,
	createBlankWordFile,
};
