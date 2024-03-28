const router = require("express").Router()
const { AuthenticationController } = require("../controllers")

router.post("/register", AuthenticationController.register)
router.post("/login", AuthenticationController.login)

module.exports = router
