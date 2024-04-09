const router = require("express").Router()
const { UserController } = require("../controllers")
const {
	authenticateToken,
	authenticateAdministrator,
} = require("../middlewares/authenticate")

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
router.patch(
	"/user/:id",
	authenticateToken,
	authenticateAdministrator,
	UserController.editUser
)
router.delete(
	"/user/:id",
	authenticateToken,
	authenticateAdministrator,
	UserController.deleteUser
)

module.exports = router
