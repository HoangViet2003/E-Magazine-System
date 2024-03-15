const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token)
		return res.status(403).send({
			status: "error",
			message: "Invalid token",
		});

	jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
		if (err)
			return res.status(403).send({
				status: "error",
				message: "Invalid token",
			});

		const userInfo = await User.findById(user._id);

		if (!userInfo)
			return res.status(401).send({
				status: "error",
				message: "User does not exist",
			});

		req.user = userInfo;

		next();
	});
};

const authenticateMarketingCoordinator = async (req, res, next) => {
	//Check if user is a marketing coordinator
	if (!req.user.role || req.user.role !== "Marketing Coordinator") {
		return res.status(403).send({
			status: "error",
			message: "You are not allowed to perform this action",
		});
	}
	next();
};

const authenticateMarketingManager = async (req, res, next) => {
	//Check if user is a marketing manager
	if (!req.user.role || req.user.role !== "Marketing Manager") {
		return res.status(403).send({
			status: "error",
			message: "You are not allowed to perform this action",
		});
	}
	next();
};

const authenticateAdministrator = async (req, res, next) => {
	//Check if user is an administrator
	if (!req.user.role || req.user.role !== "Administrator") {
		return res.status(403).send({
			status: "error",
			message: "You are not allowed to perform this action",
		});
	}
	next();
};

module.exports = {
	authenticateToken,
	authenticateMarketingCoordinator,
	authenticateMarketingManager,
	authenticateAdministrator,
};
