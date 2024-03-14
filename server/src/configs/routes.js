const { catchAsync } = require("../utils");
const { studentRoute } = require("../routes");
// const {staffRoute} = require("../routes"); 
const{ContributionRoute} = require("../routes"); 
const db = require('../models/sequelize');
/**
 * @param {Object} app express application
 */
const routes = (app) => {
	app.get(
		"/",
		catchAsync((req, res) => {
			return res.send("jennie!");
		}), 
		

	);

	app.use("/api/v1", studentRoute);
	app.use("/api/v1", ContributionRoute);
}

	// const routes = (app) =>{
	//   app.get("/", (req, res)=>{
	// 	db.query("SELECT * FROM students")
	// 	.then(data => res.send(data))
	// 	.catch(err => console.log(err))
	//   });
	// }

	
	// app.use("/")
    

module.exports = routes;
