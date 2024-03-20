const router = require("express").Router();
const { ArticleController } = require("../controllers");
const {
	authenticateToken,
	authenticateStudent,
	authenticateMarketingCoordinator,
} = require("../middlewares/authenticate");
const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({ dest: "files/articles" });

router.post(
	"/article",
	authenticateToken,
	authenticateStudent,
	// upload.single("Word"),
	upload.array("files"),
	ArticleController.uploadArticle
);

router.get(
	"/article/student",
	authenticateToken,
	authenticateStudent,
	ArticleController.getAllArticleByStudentId
);
router.get(
	"/article/coordinator",
	authenticateToken,
	authenticateMarketingCoordinator,
	ArticleController.getAllArticleByContributionId
);
router.patch(
	"/article/publication",
	ArticleController.updateArticlesForPublication
);
router.patch("/article/favorite", ArticleController.updateArticleFavorite);
router.get("/article/search", ArticleController.searchArticle);
router.get("/article/filter", ArticleController.filterArticle);
router.get("/article/download", ArticleController.downloadAllArticleSelected);
router.get("/article/:id", ArticleController.getArticleById);

module.exports = router;