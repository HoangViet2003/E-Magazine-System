const mongoose = require("mongoose")
const config = require("./config")
// const mysql = require("mysql2");

const db = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://tuananhngo2513:Kizosaco123@cluster0.lrvvcyn.mongodb.net/magazine"
		)
		// eslint-disable-next-line
		// require("../../insertDB");
		// eslint-disable-next-line
		// await mysql.createConnection({
		// 	host: config.DB.MYSQL_URL,
		// 	user: config.DB.USER,
		// 	password: config.DB.PASSWORD,
		// 	database: config.DB.DATABASE,
		// });

		console.log("connected to database")
	} catch (err) {
		// eslint-disable-next-line
		console.log(err)
	}
}

module.exports = db
