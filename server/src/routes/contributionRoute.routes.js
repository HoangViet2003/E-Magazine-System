const router = require("express").Router();
const { ContributionController } = require("../controllers");

router.post("/contribution", ContributionController.createContribution);
router.get("/contributions", ContributionController.getAllContributions);
router.patch("/contribution/:id", ContributionController.editContribution);
router.delete("/contribution/:id", ContributionController.deleteContribution); 

module.exports = router;
