const router = require("express").Router()
const { ContributionController } = require("../controllers")
const {
	authenticateToken,
	authenticateAdministrator,
} = require("../middlewares/authenticate")

router.get("/contribution/:id", ContributionController.getContributionById)
router.get("/contributions", ContributionController.getAllContributions)
router.get(
	"/contributions/coordinator",
	authenticateToken,
	ContributionController.getAllContributionByFaculty
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
