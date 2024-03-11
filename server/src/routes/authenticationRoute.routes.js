const router = require("express").Router();
const { AuthenticationController } = require("../controllers");

router.post("/register", AuthenticationController.signUp);
router.post("/login", AuthenticationController.login);


module.exports = router;
