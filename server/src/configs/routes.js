const { catchAsync } = require("../utils");
const { studentRoute,authenticationRoute } = require("../routes");

/**
 * @param {Object} app express application
 */
const routes = (app) => {
	app.get(
		"/",
		catchAsync((req, res) => {
			return res.send("Hello world!");
		})
	);
	
	app.use("/api/v1", authenticationRoute);
	app.use("/api/v1", studentRoute);
};

module.exports = routes;
