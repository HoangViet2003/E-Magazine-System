const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const OAuth2 = google.auth.OAuth2;

const myOAuth2Client = new OAuth2(
	GOOGLE_MAILER_CLIENT_ID,
	GOOGLE_MAILER_CLIENT_SECRET,
	"https://developers.google.com/oauthplayground"
);

myOAuth2Client.setCredentials({
	refresh_token: process.env.REFRESH_TOKEN.replace("%2F%2", "//"),
});

let myAccessTokenObject, myAccessToken;

myAccessTokenObject = myOAuth2Client.getAccessToken();
myAccessToken = myAccessTokenObject?.token;

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
});

module.exports = transporter.sendMail.bind(transporter);
