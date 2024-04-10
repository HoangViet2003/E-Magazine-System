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

const createContributions = async (req, res) => {
	try {
		const { academicYear, closureDate, finalClosureDate } = req.body

		// Get the current date
		const currentDate = new Date()

		// Validate closure date is larger than today
		const closureDateTime = new Date(closureDate)
		if (closureDateTime <= currentDate) {
			return res
				.status(400)
				.json({ error: "Closure date must be later than today." })
		}

		// Get the current year
		const currentYear = currentDate.getFullYear()

		// Validate academic year
		if (academicYear !== currentYear) {
			return res
				.status(400)
				.json({ error: "Academic year must be the current year." })
		}

		// Validate closure date and final closure date are in the current year
		const finalClosureDateTime = new Date(finalClosureDate)
		if (
			closureDateTime.getFullYear() !== currentYear ||
			finalClosureDateTime.getFullYear() !== currentYear
		) {
			return res.status(400).json({
				error:
					"Closure date and final closure date must be in the current year.",
			})
		}

		// Validate final closure date is at least 14 days after closure date
		const daysDifference = Math.floor(
			(finalClosureDateTime - closureDateTime) / (1000 * 60 * 60 * 24)
		)
		if (daysDifference < 14) {
			return res.status(400).json({
				error:
					"Final closure date must be at least 14 days after closure date.",
			})
		}

		// Check if all faculties already have contributions for the academic year
		const faculties = await Faculty.find().select("_id")
		const facultyIds = faculties.map((faculty) => faculty._id)
		const facultyContributions = await Contribution.aggregate([
			{
				$match: {
					facultyId: { $in: facultyIds },
					academicYear: currentYear.toString(),
				},
			},
			{
				$group: {
					_id: "$facultyId",
					count: { $sum: 1 },
				},
			},
		])

		// If all faculties have contributions, no need to create new ones
		if (facultyContributions.length === facultyIds.length) {
			return res.status(200).json({
				message:
					"All faculties already have contributions for the academic year.",
			})
		}

		// Create contributions for faculties that don't have contributions yet
		const facultiesWithoutContributions = faculties.filter((faculty) => {
			return !facultyContributions.find((contribution) =>
				contribution._id.equals(faculty._id)
			)
		})

		const contributions = facultiesWithoutContributions.map((faculty) => {
			return Contribution.create({
				facultyId: faculty._id,
				status: "open",
				academicYear,
				closureDate,
				finalClosureDate,
			})
		})

		await Promise.all(contributions)

		res.status(201).json({
			status: "Create contributions for all of faculties successfully!",
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const getAllContributions = async (req, res) => {
	try {
		// get contribtuion object with the academic year, only one for each academic year
		const contributions = await Contribution.aggregate([
			{
				$group: {
					_id: "$academicYear",
					academicYear: { $first: "$academicYear" },
					facultyId: { $first: "$facultyId" },
					status: { $first: "$status" },
					closureDate: { $first: "$closureDate" },
					finalClosureDate: { $first: "$finalClosureDate" },
				},
			},
			// sorted by academicYear
			{
				$sort: {
					academicYear: -1,
				},
			},
		])

		res.status(200).json({
			contributions,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const getAllContributionsByAcamemicYear = async (req, res) => {
	try {
		const { academicYear } = req.query
		const contributions = await Contribution.find({ academicYear }).populate(
			"facultyId"
		)

		return res.status(200).json({
			contributions,
		})
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const getAllContributionByFaculty = catchAsync(async (req, res) => {
	try {
		const { facultyId, role } = req.user

		if (
			role !== "marketing coordinator" &&
			role !== "guest" &&
			role !== "student"
		) {
			return res
				.status(403)
				.json({ error: "You do not have permission to access this route" })
		}

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
			contributions,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

const updateContributions = async (req, res) => {
	try {
		const { academicYear, closureDate, finalClosureDate } = req.body

		// Get the current date
		const currentDate = new Date()

		// Validate closure date is larger than today
		const closureDateTime = new Date(closureDate)
		if (closureDateTime <= currentDate) {
			return res
				.status(400)
				.json({ error: "Closure date must be later than today." })
		}

		// Get the current year
		const currentYear = currentDate.getFullYear()

		// Validate academic year
		if (academicYear !== currentYear) {
			return res
				.status(400)
				.json({ error: "Academic year must be the current year." })
		}

		// Validate closure date and final closure date are in the current year
		const finalClosureDateTime = new Date(finalClosureDate)
		if (
			closureDateTime.getFullYear() !== currentYear ||
			finalClosureDateTime.getFullYear() !== currentYear
		) {
			return res.status(400).json({
				error:
					"Closure date and final closure date must be in the current year.",
			})
		}

		// Validate final closure date is at least 14 days after closure date
		const daysDifference = Math.floor(
			(finalClosureDateTime - closureDateTime) / (1000 * 60 * 60 * 24)
		)
		if (daysDifference < 14) {
			return res.status(400).json({
				error:
					"Final closure date must be at least 14 days after closure date.",
			})
		}

		// Update contributions based on the provided criteria
		await Contribution.updateMany(
			{ academicYear: academicYear },
			{ closureDate: closureDate, finalClosureDate: finalClosureDate }
		)

		res.status(200).json({
			status: "success",
			message: "Contributions updated successfully.",
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const deleteContributions = async (req, res) => {
	try {
		const { academicYear } = req.body

		// Get the current date
		const currentDate = new Date()

		// Get the current year
		const currentYear = currentDate.getFullYear()

		// Validate academic year
		if (academicYear !== currentYear) {
			return res
				.status(400)
				.json({ error: "Academic year must be the current year." })
		}

		// Delete contributions based on the provided criteria
		const result = await Contribution.deleteMany({ academicYear: academicYear })

		if (result.deletedCount === 0) {
			return res.status(404).json({
				error: "No contributions found for the specified academic year.",
			})
		}

		res.status(200).json({
			message: `Deleted ${result.deletedCount} contributions for the academic year ${academicYear}.`,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

module.exports = {
	createContributions,
	getAllContributions,
	getAllContributionByFaculty,
	getAllContributionsByAcamemicYear,
	getContributionById,
	updateContributions,
	deleteContributions,
}
