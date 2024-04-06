const { catchAsync } = require("../utils")
const { Contribution, Faculty } = require("../models")

const getContributionById = async (req, res) => {
	try {
		const { id } = req.params
		const contribution = await Contribution.findById(id)

		if (!contribution) {
			return res.status(400).json({
				status: "fail",
				message: "Contribution does not exist",
			})
		}

		res.status(200).json({
			contribution,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const createContribution = async (req, res) => {
	try {
		const { facultyId, status, academicYear } = req.body

		const closureDate = new Date()

		//final closureDtate is 3 day after closure date
		const finalClosureDate = new Date(
			closureDate.getTime() + 3 * 24 * 60 * 60 * 1000
		)

		const newContribution = new Contribution({
			facultyId,
			status,
			academicYear,
			closureDate,
			finalClosureDate,
		})

		await newContribution.save()

		res.status(201).json({
			status: "success",
			data: newContribution,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const getAllContributions = async (req, res) => {
	try {
		const contributions = await Contribution.find()
		res.status(200).json({
			status: "success",
			data: contributions,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const getAllContributionByFaculty = catchAsync(async (req, res) => {
	try {
		const { facultyId } = req.user
		if (!facultyId) {
			return res.status(400).json({
				status: "fail",
				message: "Faculty ID is required",
			})
		}
		const faculty = await Faculty.findById(facultyId)

		if (!faculty) {
			return res.status(400).json({ error: "Faculty does not exist" })
		}

		const contributions = await Contribution.find({ facultyId: facultyId })

		res.status(200).json({
			status: "success",
			contributions,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

module.exports = {
	createContribution,
	getAllContributions,
	getAllContributionByFaculty,
	getContributionById,
}
