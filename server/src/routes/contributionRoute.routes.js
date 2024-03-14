const router = require("express").Router();
const { ContributionController } = require("../controllers");
const { authenticateToken } = require("../middlewares/authenticate");
const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({ dest: "files/articles" });

router.post(
	"/contribution",
	authenticateToken,
	// upload.single("Word"),
	upload.array("Files"),
	ContributionController.uploadArticle
);

module.exports = router;
