const router = require("express").Router()
const { HistoryController } = require("../controllers")
const { authenticateToken } = require("../middlewares/authenticate")

router.get(
	"/history/submission/:submissionId",
	authenticateToken,
	HistoryController.getHistoryBySubmissionId
)

router.get(
	"/history/user/:userId",
	authenticateToken,
	HistoryController.getHistoryByUserId
)

module.exports = router
