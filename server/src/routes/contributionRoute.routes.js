const router = require("express").Router()
const { ContributionController } = require("../controllers")
const {
	authenticateToken,
	authenticateAdministrator,
	authenticateMarketingManager,
} = require("../middlewares/authenticate")

router.get("/contribution/:id", ContributionController.getContributionById)
router.get(
	"/contributions",
	authenticateToken,
	authenticateMarketingManager,
	ContributionController.getAllContributions
)
router.get(
	"/contributions/coordinator",
	authenticateToken,
	ContributionController.getAllContributionByFaculty
)
router.get(
	"/contributions/academic-year",
	authenticateToken,
	authenticateMarketingManager,
	ContributionController.getAllContributionsByAcamemicYear
)

router.post(
	"/contribution",
	authenticateAdministrator,
	ContributionController.createContribution
)

router.put(
	"/contribution/:id",
	authenticateAdministrator,
	ContributionController.updateContribution
)
module.exports = router
