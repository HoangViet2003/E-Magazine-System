const router = require("express").Router();
const { ContributionController } = require("../controllers");

router.post("/contribution", ContributionController.createContribution);
router.get("/contributions", ContributionController.getAllContributions);
router.get("/contributions/marketing-coordinator", ContributionController.getAllContributionByFaculty);

module.exports = router;
