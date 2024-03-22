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

router.put(
	"/article/:id",
	authenticateToken,
	authenticateStudent,
	upload.array("files"),
	ArticleController.updateArticle
);

router.patch(
	"/article/publication",
	authenticateToken,
	authenticateMarketingCoordinator,
	ArticleController.updateArticlesForPublication
);
router.patch("/article/favorite",authenticateToken,authenticateMarketingCoordinator, ArticleController.updateArticleFavorite);
router.get("/article/search", ArticleController.searchArticle);
router.get("/article/filter", ArticleController.filterArticle);
router.post("/article/download", ArticleController.downloadAllArticleSelected);
router.get(
	"/article/coordinator/:id",
	authenticateToken,
	authenticateMarketingCoordinator,
	ArticleController.getAllArticleByContributionId
);
router.get("/article/:id",authenticateToken, ArticleController.getArticleById);

module.exports = router;
