const { catchAsync } = require("../utils");
const {
	studentRoute,
	authenticationRoute,
	articleRoute,
	contributionRoute

} = require("../routes");

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
	app.use("/api/v1", articleRoute);
	app.use("/api/v1", contributionRoute);
};

module.exports = routes;
