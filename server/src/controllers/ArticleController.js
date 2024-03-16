const fs = require("fs");
const {
	uploadFiles,
	deleteFiles,
	getFileStream,
} = require("../services/fileS3.services");
const mammoth = require("mammoth");
const { Article } = require("../models");

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
			// If Type is "word" and Word file is uploaded
			const filePath = req.files[0].path;
			if (
				req.files[0].mimetype !==
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			) {
				// Invalid file type for "word"
				return res.status(400).json({
					status: "error",
					message: "Please upload a Word document (.docx)",
				});
			}

			mammoth
				.convertToHtml({ path: filePath })
				.then(async (result) => {
					const html = result.value; // The generated HTML
					const newArticle = await Article.create({
						contributionId,
						studentId: student._id,
						content: html,
						type,
					});

					return res.status(201).json(newArticle);
				})
				.catch((error) => {
					console.error("Mammoth error:", error);
					res.status(500).send({
						status: "error",
						message: "Error converting Word to HTML",
					});
				});
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
				contributionId,
				studentId: student._id,
				type,
				content: images,
			});

			await newArticle.save();

			//TODO: Delete the files from the server
			// TODO: Send email to admin

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

			// TODO : Send email to student
			// TODO: Create notification for admin
			// TODO: Create history for contribution
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

//handle update article

module.exports = {
	uploadArticle,
};
