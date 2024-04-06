const router = require("express").Router()
const { UserController } = require("../controllers")
const { authenticateAdministrator } = require("../middlewares/authenticate")
// const middlewareController = require("../controllers/middlewareController")

router.get("/users", authenticateAdministrator, UserController.getAllUsers)
router.patch("/user/:id", UserController.editUser)
router.delete("/user/:id", UserController.deleteUser)

module.exports = router
