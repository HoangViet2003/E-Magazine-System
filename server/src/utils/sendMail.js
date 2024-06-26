const nodemailer = require("nodemailer")
const { google } = require("googleapis")

const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REFRESH_TOKEN = process.env.REFRESH_TOKEN
const ejs = require("ejs")
const path = require("path")
const { throws } = require("assert")
const OAuth2 = google.auth.OAuth2

const myOAuth2Client = new OAuth2(
	GOOGLE_MAILER_CLIENT_ID,
	GOOGLE_MAILER_CLIENT_SECRET,
	"https://developers.google.com/oauthplayground"
)

myOAuth2Client.setCredentials({
	refresh_token: process.env.REFRESH_TOKEN.replace("%2F%2", "//"),
})

let myAccessTokenObject, myAccessToken

myAccessTokenObject = myOAuth2Client.getAccessToken()
myAccessToken = myAccessTokenObject?.token

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: process.env.EMAIL,
		clientId: GOOGLE_MAILER_CLIENT_ID,
		clientSecret: GOOGLE_MAILER_CLIENT_SECRET.replace(/\\n/g, "\n"),
		refreshToken: GOOGLE_REFRESH_TOKEN,
		accessToken: myAccessToken,
	},
})

const sendMail = async (mailOptions) => {
	// Send mail with defined transport object
	return transporter.sendMail(mailOptions)
}

const handleSendEmail = async ({ to, subject, html }) => {
	try {
		await sendMail({
			to: to,
			subject: subject,
			html,
		})
	} catch (error) {
		console.log("Error sending email to marketing coordinator:", error)
		throw ("Error sending email to marketing coordinator:", error)
	}
}

module.exports = { sendMail, handleSendEmail }
