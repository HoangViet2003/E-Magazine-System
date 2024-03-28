const router = require("express").Router()
const { ArticleController } = require("../controllers")
const {
	authenticateToken,
	authenticateStudent,
	authenticateMarketingCoordinator,
} = require("../middlewares/authenticate")
const multer = require("multer")
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({ dest: "files/articles" })

router.post(
	"/article",
	authenticateToken,
	authenticateStudent,
	// upload.single("Word"),
	upload.array("files"),
	ArticleController.uploadArticle
)

router.get(
	"/article/dashboard",
	authenticateToken,
	ArticleController.getDashboard
)

router.get(
	"/article/student",
	authenticateToken,
	authenticateStudent,
	ArticleController.getAllArticlesByStudentId
)

router.put(
	"/article/:articleId",
	authenticateToken,
	authenticateStudent,
	upload.array("files"),
	ArticleController.updateArticle
)

router.patch(
	"/article/publication",
	authenticateToken,
	authenticateMarketingCoordinator,
	ArticleController.updateArticlesForPublication
)

router.post(
	"/article/create-doc",
	authenticateToken,
	authenticateStudent,
	ArticleController.createBlankWordFile
)
router.patch(
	"/article/favourite",
	authenticateToken,
	authenticateMarketingCoordinator,
	ArticleController.updateArticleFavorite
)
router.get(
	"/article/suggestions",
	authenticateToken,
	ArticleController.getSuggestionArticles
)
router.get(
	"/article/filter",
	authenticateToken,
	ArticleController.filterArticle
)
router.post("/article/download", ArticleController.downloadAllArticleSelected)
router.get(
	"/article/faculty/:facultyId",
	authenticateToken,
	authenticateMarketingCoordinator,
	ArticleController.getAllArticlesByFacultyId
)

router.get(
	"/article/submission/:submissionId",
	authenticateToken,
	ArticleController.getAllArticlesBySubmissionId
)
router.get(
	"/article/:articleId",
	authenticateToken,
	ArticleController.getArticleById
)

router.delete(
	"/article/:articleId",
	authenticateToken,
	authenticateStudent,
	ArticleController.deleteArticle
)
module.exports = router
