const fs = require("fs");
const {
	uploadFiles,
	deleteFiles,
	getFileStream,
} = require("../services/fileS3.services");
const mammoth = require("mammoth");
const { Article, Contribution, History, User } = require("../models");
const { sendEmail } = require("../utils");
const EmitterSingleton = require("../configs/eventEmitter");

const emitterInstance = EmitterSingleton.getInstance();
const emitter = emitterInstance.getEmitter();

const uploadArticle = async (req, res) => {
	try {
		const { type } = req.body;
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

		//Find contribution by student id
		const contribution = await Contribution.findOne({ studentId: student._id });

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
					const newArticle = {
						type,
						content: html,
					};

					//add to contribution.content
					await contribution.files.push(newArticle);
					contribution.save();

					return res.status(201).json({
						status: "success",
						message: "Article uploaded successfully",
						contribution,
					});
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

			const newArticle = {
				type,
				content: images,
			};

			//add to contribution.content
			await contribution.files.push(newArticle);
			contribution.save();

			//TODO: Delete the files from the server
			await req.files.forEach(async (file) => {
				await fs.promises.unlink(file.path);
			});

			// TODO: Send email to marketing coordinator

			//find marketing coordinator
			const marketingCoordinator = await User.findOne({
				role: "marketing coordinator",
				facultyId: student.facultyId,
			});

			//send email to marketing coordinator
			const subjectToMarketingCoordinator = "Article uploaded successfully";
			const htmlForMarketingCoordinator = `
			<p>Dear ${marketingCoordinator.name},</p>
			<p>${student.name} has uploaded an article. Please review it.</p>
			<p>Thank you!</p>
		`;
			await sendEmail(
				marketingCoordinator.email,
				subjectToMarketingCoordinator,
				htmlForMarketingCoordinator
			);

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
			const studentEmail = "vietnhgch210639@fpt.edu.vn";
			const subject = "Article uploaded successfully";
			const emailHtml = `
            <p>Dear ${student.name},</p>
            <p>Your article has been successfully uploaded.
            <p>Thank you for your contribution!</p>
        `;
			await sendEmail(studentEmail, subject, emailHtml);

			// TODO: Create notification for admin
			emitter.emit("notifyMarketingCoordinator", {
				facultyId: student.facultyId,
				message: `${student.name} has uploaded an article. Please review it.`,
			});

			// TODO: Create history for contribution
			const history = new History({
				contributionId: contribution._id,
				action: "create",
				userId: student._id,
			});

			return res.status(201).send({
				status: "success",
				message: "Article uploaded successfully",
				contribution,
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
