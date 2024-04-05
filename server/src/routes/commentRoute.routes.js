const router = require("express").Router()
const { CommentController } = require("../controllers")
const { authenticateToken } = require("../middlewares/authenticate")

router.get(
	"/submission/:id/comments",
	authenticateToken,
	CommentController.getCommentsByAr
)

router.post(
	"/submission/:id/comment",
	authenticateToken,
	// upload.single("Word"),
	CommentController.addComment
)

router.post(
	"/comment/:id/reply",
	authenticateToken,
	CommentController.replyComment
)

router.delete(
	"/comment/:id",
	authenticateToken,
	CommentController.deleteComment
)

module.exports = router
