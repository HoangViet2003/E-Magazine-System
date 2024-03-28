const router = require("express").Router()
const { ContributionController } = require("../controllers")
const {
	authenticateToken,
	authenticateMarketingCoordinator,
} = require("../middlewares/authenticate")

router.post("/contribution", ContributionController.createContribution)
router.get("/contributions", ContributionController.getAllContributions)
router.get(
	"/contributions/coordinator",
	authenticateToken,
	authenticateMarketingCoordinator,
	ContributionController.getAllContributionByFaculty
)

module.exports = router
