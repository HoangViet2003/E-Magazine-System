const router = require("express").Router()
const { NotificationController } = require("../controllers")
const { authenticateToken } = require("../middlewares/authenticate")

router.get(
    "/notifications",
    authenticateToken,
    NotificationController.getAllNotificationByUserId
)

router.patch(
    "/notification",
    authenticateToken,
    NotificationController.updateUnSeenNotification
)


module.exports = router
