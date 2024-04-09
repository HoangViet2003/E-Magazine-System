const { Notification } = require("../models")

const getAllNotificationByUserId = async (req, res) => {
	try {
		const user = req.user
		const page = parseInt(req.query.page) || 1
		const limit = 5
		const skip = (page - 1) * limit

		const notifications = await Notification.find({ receiver: user._id })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)

		const totalNotification = await Notification.countDocuments({
			receiver: user._id,
		})
		const totalUnSeenNotification = await Notification.countDocuments({
			receiver: user._id,
			isRead: false,
		})

		res.status(200).json({
			notifications,
			totalPage: Math.ceil(totalNotification / limit),
			totalNotification,
			totalUnSeenNotification,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const updateUnSeenNotification = async (req, res) => {
	try {
		const user = req.user
		await Notification.updateMany(
			{ receiver: user._id, isRead: false },
			{ isRead: true }
		)

		res.status(200).json({ message: "Notification updated" })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

module.exports = {
	getAllNotificationByUserId,
	updateUnSeenNotification,
}

