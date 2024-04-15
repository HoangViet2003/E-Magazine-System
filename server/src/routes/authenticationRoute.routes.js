const router = require("express").Router()
const { AuthenticationController } = require("../controllers")

router.post("/register", AuthenticationController.register)
router.post("/login", AuthenticationController.login)

router.post(
	"/confirm-reset-password",
	AuthenticationController.confirmResetPassword
)

router.post("/reset-password", AuthenticationController.resetPassword)

module.exports = router
