const jwt = require("jsonwebtoken")
const { User, Faculty, Contribution, Article } = require("../models")

const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"]
	const token = authHeader && authHeader.split(" ")[1]
	if (!token)
		return res.status(403).send({
			status: "error",
			message: "Invalid token",
		})

	jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
		if (err)
			return res.status(403).send({
				status: "error",
				message: "Invalid token",
			})

		const userInfo = await User.findById(user._id)

		if (!userInfo)
			return res.status(401).send({
				status: "error",
				message: "User does not exist",
			})

		req.user = userInfo

		next()
	})
}

const authenticateMarketingCoordinator = async (req, res, next) => {
	//Check if user is a marketing coordinator
	if (req.user.role !== "marketing coordinator") {
		return res.status(403).send({
			message: "You are not allowed to perform this action",
		})
	}

	// const facultyIdRequest =
	// 	req.params.facultyId || req.body.facultyId || req.query.facultyId;

	// //Check if user has access to the specified faculty
	// if (req.user.facultyId.toString() === facultyIdRequest.toString()) {
	// 	next();
	// } else {
	// 	return res.status(403).send({
	// 		message: "You are not allowed to perform this action",
	// 	});
	// }

	//check if the user has access to the specified article
	const articleIdRequest =
		req.params.articleId || req.body.articleId || req.query.articleId

	if (articleIdRequest) {
		const article = await Article.findOne({ facultyId: req.user.facultyId })

		if (!article) {
			return res.status(403).send({
				message: "You are not allowed to perform this action",
			})
		}
	}
	next()
}

const authenticateStudent = async (req, res, next) => {
	//Check if user is a student
	if (req.user.role !== "student") {
		return res.status(403).send({
			message: "You are not allowed to perform this action",
		})
	}

	// const contributionIdRequest =
	// 	req.params.contributionId ||
	// 	req.body.contributionId ||
	// 	req.query.contributionId;
	// //Check if user has access to the specified contribution
	// if (contributionIdRequest) {
	// 	const contribution = await Contribution.findById(contributionIdRequest);
	// 	if (
	// 		!contribution ||
	// 		contribution.facultyId.toString() !== req.user.facultyId.toString()
	// 	) {
	// 		return res.status(403).json({
	// 			message: "You do not have access to this resource",
	// 		});
	// 	}
	// }

	//check if the user has access to the specified article
	const articleIdRequest =
		req.params.articleId || req.body.articleId || req.query.articleId

	if (articleIdRequest) {
		const article = await Article.findOne({ facultyId: req.user.facultyId })

		if (!article) {
			return res.status(403).send({
				message: "You are not allowed to perform this action",
			})
		}
	}

	next()
}

const authenticateMarketingManager = async (req, res, next) => {
	//Check if user is a marketing manager
	if (!req.user.role || req.user.role !== "marketing Manager") {
		return res.status(403).send({
			status: "error",
			message: "You are not allowed to perform this action",
		})
	}

	next()
}

const authenticateAdministrator = async (req, res, next) => {
	//Check if user is an administrator
	if (!req.user.role || req.user.role !== "administrator") {
		return res.status(403).send({
			status: "error",
			message: "You are not allowed to perform this action",
		})
	}
	next()
}

module.exports = {
	authenticateToken,
	authenticateMarketingCoordinator,
	authenticateMarketingManager,
	authenticateAdministrator,
	authenticateStudent,
}
