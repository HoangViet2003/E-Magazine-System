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
	ContributionController.getAllContributions
)


router.get(
	"/search-contribution",
	authenticateToken,
	authenticateAdministrator,
	ContributionController.searchContribution
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
	"/contributions",
	authenticateToken,
	authenticateAdministrator,
	ContributionController.createContributions
)

router.put(
	"/contributions",
	authenticateToken,
	authenticateAdministrator,
	ContributionController.updateContributions
)

router.delete(
	"/contributions",
	authenticateToken,
	authenticateAdministrator,
	ContributionController.deleteContributions
)

module.exports = router
