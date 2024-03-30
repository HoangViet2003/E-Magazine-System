const router = require("express").Router()
const { SubmissionController } = require("../controllers")
const {
	authenticateToken,
	authenticateMarketingCoordinator,
	authenticateStudent,
} = require("../middlewares/authenticate")

router.post(
	"/submission",
	authenticateToken,
	authenticateStudent,
	SubmissionController.createSubmission
)
router.get(
	"/submissions",
	authenticateToken,
	authenticateMarketingCoordinator,
	SubmissionController.getAllSubmissions
)
router.get(
	"/submissions/contribution/:contributionId",
	authenticateToken,
	authenticateMarketingCoordinator,
	SubmissionController.getAllSubmissionByContributionId
)
router.get(
	"/submission/student",
	authenticateToken,
	authenticateStudent,
	SubmissionController.getSubmissionByStudentId
)

router.get(
	"/submission/contribution/:contributionId",
	authenticateToken,
	SubmissionController.getSubmissionByContributionId
)

router.patch(
	"/submission/:submissionId/publication",
	authenticateToken,
	authenticateMarketingCoordinator,
	SubmissionController.updateForPublication
)

module.exports = router
