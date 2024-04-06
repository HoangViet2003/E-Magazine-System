const router = require("express").Router()
const { CommentController } = require("../controllers")
const { authenticateToken } = require("../middlewares/authenticate")

router.get(
	"/submission/:id/comments",
	authenticateToken,
	CommentController.getCommentsBySubmission
)

router.post(
	"/submission/:id/comment",
	authenticateToken,
	// upload.single("Word"),
	CommentController.addComment
)

router.post(
	"/comment/:commentId/reply",
	authenticateToken,
	CommentController.replyComment
)

router.delete(
	"/comment/:id",
	authenticateToken,
	CommentController.deleteComment
)

module.exports = router
