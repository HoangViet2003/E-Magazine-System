const { catchAsync } = require("../utils");
const {
	userRoute,
	authenticationRoute,
	articleRoute,
	contributionRoute,
	facultyRoute


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
	app.use("/api/v1", articleRoute);
	app.use("/api/v1", contributionRoute);
	app.use("/api/v1", userRoute);
	app.use("/api/v1", facultyRoute);
};

module.exports = routes;
