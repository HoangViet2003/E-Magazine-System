const { History } = require("../models")

const StatusCode = require("http-status-codes")

const getHistoryBySubmissionId = async (req, res) => {
	try {
		const { submissionId } = req.params
		const { page } = req.query

		const limits = 10
		const skip = (page - 1) * limits

		const histories = await History.find({
			submissionId,
		})
			.limit(limits)
			.skip(skip)

		const totalLength = await History.countDocuments({ submissionId })
		const totalPage = Math.ceil(totalLength / limits)

		return res.status(StatusCode.OK).send({ histories, totalLength, totalPage })
	} catch (err) {
		return res.status(StatusCode.INTERNAL_SERVER_ERROR).send(err)
	}
}

const getHistoryByUserId = async (req, res) => {
	try {
		const { userId } = req.params
		const { page } = req.query

		const limits = 10
		const skip = (page - 1) * limits

		const histories = await History.find({
			userId,
		})
			.limit(limits)
			.skip(skip)

		const totalLength = await History.countDocuments({ userId })
		const totalPage = Math.ceil(totalLength / limits)

		return res.status(StatusCode.OK).send({ histories, totalLength, totalPage })
	} catch (err) {
		return res.status(StatusCode.INTERNAL_SERVER_ERROR).send(err)
	}
}

module.exports = {
	getHistoryBySubmissionId,
	getHistoryByUserId,
}
