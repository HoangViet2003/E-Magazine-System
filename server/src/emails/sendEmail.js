const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: "zeusson3@gmail.com", // Your Gmail email address
		pass: "rfiq tiiw gqix ypqx", // Your Gmail password
	},
});

const sendEmail = async (to, subject, html) => {
	try {
		const mailOptions = {
			from: "zeusson3@gmail.com",
			to,
			subject,
			html,
		};

		await transporter.sendMail(mailOptions);
		console.log("Email sent successfully");
	} catch (error) {
		console.error("Error sending email:", error);
	}
};

module.exports = { sendEmail };
