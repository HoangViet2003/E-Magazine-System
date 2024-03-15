const router = require("express").Router();
const { ArticleController} = require("../controllers");
const { authenticateToken } = require("../middlewares/authenticate");
const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({ dest: "files/articles" });

router.post(
	"/article",
	authenticateToken,
	// upload.single("Word"),
	upload.array("Files"),
	ArticleController.uploadArticle
);

module.exports = router;
