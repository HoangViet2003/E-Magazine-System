const router = require("express").Router()
const { ContributionController } = require("../controllers")
const { authenticateToken } = require("../middlewares/authenticate")

router.get("/contribution/:id", ContributionController.getContributionById)
router.post("/contribution", ContributionController.createContribution)
router.get("/contributions", ContributionController.getAllContributions)
router.get(
	"/contributions/coordinator",
	authenticateToken,
	ContributionController.getAllContributionByFaculty
)

module.exports = router
