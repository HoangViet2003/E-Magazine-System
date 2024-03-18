const router = require("express").Router();
const { CommentController } = require("../controllers");
const { authenticateToken } = require("../middlewares/authenticate");

router.get(
	"/article/:id/comments",
	authenticateToken,
	CommentController.getCommentsByAr
);

router.post(
	"/article/:id/comment",
	authenticateToken,
	// upload.single("Word"),
	CommentController.addComment
);

module.exports = router;
