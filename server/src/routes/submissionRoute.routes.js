const router = require("express").Router()
const { SubmissionController } = require("../controllers")
const {
	authenticateToken,
	authenticateMarketingCoordinator,
	authenticateStudent,
} = require("../middlewares/authenticate")

router.get(
	"/submission/:submissionId",
	authenticateToken,
	SubmissionController.getSubmissionById
)

router.post(
	"/submission",
	authenticateToken,
	authenticateStudent,
	SubmissionController.createSubmission
)

router.get(
	"/submissions/contribution/:contributionId",
	authenticateToken,
	authenticateMarketingCoordinator,
	SubmissionController.getAllSubmissionByContributionId
)

router.get(
	"/submission/:submissionId/unselectedArticles",
	authenticateToken,
	authenticateStudent,
	SubmissionController.getUnselectedArticlesOfStudentsBySubmissionId
)

router.get(
	"/submission/contribution/:contributionId",
	authenticateToken,
	SubmissionController.getSubmissionByContributionId
)

router.put(
	"/submission/:submissionId/addArticle",
	authenticateToken,
	authenticateStudent,
	SubmissionController.addArticlesToSubmission
)

router.put(
	"/submission/:submissionId/removeArticle",
	authenticateToken,
	authenticateStudent,
	SubmissionController.removeArticlesFromSubmission
)

router.patch(
	"/submission/:submissionId/publication",
	authenticateToken,
	authenticateMarketingCoordinator,
	SubmissionController.updateForPublication
)

router.patch(
	"/submission/:submissionId/submit",
	authenticateToken,
	authenticateStudent,
	SubmissionController.toggleSubmissionStatus
)

router.delete(
	"/submission/:submissionId",
	authenticateToken,
	SubmissionController.removeSubmission
)

module.exports = router
