const router = require("express").Router()
const { UserController } = require("../controllers")
const {
	authenticateToken,
	authenticateAdministrator,
} = require("../middlewares/authenticate")
// const middlewareController = require("../controllers/middlewareController")

router.get(
	"/users",
	authenticateToken,
	authenticateAdministrator,
	UserController.getAllUsers
)
router.post(
	"/user",
	authenticateToken,
	authenticateAdministrator,
	UserController.createUser
)
// router.patch("/user/:id", authenticateAdministrator, UserController.editUser)
router.delete("/user/:id", authenticateAdministrator, UserController.deleteUser)

module.exports = router
