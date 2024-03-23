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
} = require("../models");
const { handleSendEmail } = require("../utils/sendMail");

const EmitterSingleton = require("../configs/eventEmitter");
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
				title: student.name + "'s images",
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

const updateArticle = async (req, res) => {
	const { id } = req.params;
	const { content, type, title } = req.body;
	const { files } = req;

	try {
		const article = await Article.findById(id);

		if (!article && !type) {
			throw new Error("Article does not exist or invalid type");
		}

		if (type === "word" && files.length > 0) {
			//update content in article to new content
			article.content = content;
		}

		if (files && files.length > 0 && type === "image") {
			const uploadPromises = files.map(async (file) => {
				// Assuming uploadFiles and deleteFiles functions are defined
				// Upload new images
				await uploadFiles(file, "articles/");
				await fs.promises.unlink(file.path);
				return `https://magazine-images-upload.s3.ap-southeast-1.amazonaws.com/article/${file.originalname}`;
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

//getAll article by studentId
const getAllArticlesByStudentId = async (req, res) => {
	try {
		// return result
		const student = req.user;

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
			articles,
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

		res.status(200).json({ article });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//get All article by contributionId
const getAllArticlesByFacultyId = async (req, res) => {
	try {
		const { id } = req.params;
		const marketingCoordinator = req.user;

		// Check if the user is the marketing coordinator of the faculty
		const faculty = await Faculty.findById(id);
		if (
			!faculty ||
			marketingCoordinator._id.toString() !==
				faculty.marketingCoordinatorId.toString()
		) {
			return res.status(403).json({
				error: "You are not the marketing coordinator of this faculty",
			});
		}

		// Find all contributions for the faculty
		const contributions = await Contribution.find({ facultyId: id });

		const page = parseInt(req.query.page) || 1;
		const limit = 5;
		const skip = (page - 1) * limit;

		// Aggregate to get articles and total length
		const articlesAggregate = await Article.aggregate([
			{
				$match: { contributionId: { $in: contributions.map((c) => c._id) } },
			},
			{ $skip: skip },
			{ $limit: limit },
			{
				$lookup: {
					from: "users", // Assuming the collection name for User model is 'users'
					localField: "studentId",
					foreignField: "_id",
					as: "student",
				},
			},
			{
				$addFields: {
					studentName: { $arrayElemAt: ["$student.name", 0] }, // Get the name from student array
				},
			},
			{
				$unset: "student", // Remove the 'student' field
			},
			{
				$group: {
					_id: null,
					count: { $sum: 1 },
					articles: { $push: "$$ROOT" }, // Push the articles into an array
				},
			},
			{
				$project: {
					_id: 0,
					totalLength: "$count",
					articles: { $slice: ["$articles", limit] }, // Limit articles array to 'limit' elements
				},
			},
		]);

		let totalLength = 0;
		let articles = [];

		// Extract totalLength and articles from the aggregation result
		if (articlesAggregate.length > 0) {
			totalLength = articlesAggregate[0].totalLength;
			articles = articlesAggregate[0].articles;
		}

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

		if (!article) {
			return res
				.status(404)
				.json({ status: "error", error: "Article not found" });
		}

		if (user.role === "student") {
			if (article.studentId.toString() != user._id.toString()) {
				return res
					.status(403)
					.json({ error: "You are not allowed to perform this action" });
			}
		} else {
			return res.status
				.status(403)
				.json({ error: "You are not allowed to perform this action" });
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
		const marketingCoordinatorId = user._id;
		const faculty = await Faculty.findOne({
			marketingCoordinatorId: marketingCoordinatorId,
		});

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

		// check if the marketing coordinator is the marketing coordinator of the current faculty
		const marketingCoordinatorId = user._id;
		const faculty = await Faculty.findOne({ marketingCoordinatorId });

		const contribution = await Contribution.findOne({ facultyId: faculty._id });

		const articles = await Article.find({ _id: { $in: articleIds } });
		articles.forEach((article) => {
			if (article.contributionId.toString() != contribution._id.toString()) {
				return res.status(403).json({
					error: "You are not the marketing coordinator of this faculty",
				});
			}
		});

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
const searchArticles = async (req, res) => {
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

		// Get all keys from req.query
		const articlesKeys = Object.keys(req.query);

		// Constructing the match query for aggregation
		let matchQuery = {};

		// Check if keys are present in req.query and add them to matchQuery
		articlesKeys.forEach((key) => {
			if (key === "title") {
				matchQuery.title = { $regex: new RegExp(req.query[key], "i") };
			} else {
				matchQuery[key] = req.query[key];
			}
		});

		// Constructing the match query for aggregation
		// const matchQuery = {
		// 	title: { $regex: new RegExp(title, "i") },
		// 	contributionId: contributionId,
		// 	type: type,
		// 	isFavorite: isFavorite,
		// 	isSelectedForPublication: isSelectedForPublication,
		// };


		// Using a single aggregation pipeline for fetching articles and getting total count
		const [articles, totalLength] = await Promise.all([
			Article.find(matchQuery),
			Article.aggregate([{ $match: matchQuery }, { $count: "total" }]),
		]);

		if (articles.length === 0) {
			return res
				.status(404)
				.json({ status: "error", message: "No articles found" });
		}

		// Extracting the total count from the result
		const totalCount = totalLength.length > 0 ? totalLength[0].total : 0;

		res.status(200).json({
			articles,
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
	searchArticles,
	filterArticle,
	downloadAllArticleSelected,
	deleteArticle,
	getDashboard,
};
