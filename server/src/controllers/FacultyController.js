const { Faculty } = require("../models")
const { User } = require("../models")
const { StatusCodes } = require("http-status-codes")
const { validateData } = require("../validations/validation")

const createFaculty = async (req, res) => {
	const { name } = req.body
	try {
		// check if marketingCoordinatorId exists
		// const user = await User.findById(marketingCoordinatorId)

		// if (!user) {
		// 	return res.status(StatusCodes.NOT_FOUND).json({
		// 		error: "marketing coordinator id does not exist!",
		// 	})
		// }

		const newFaculty = await Faculty.create({
			name,
		})

		return res.status(StatusCodes.CREATED).json({
			newFaculty,
		})
	} catch (error) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

const addMarketingCoordinator = async (req, res) => {
	const { user_id } = req.body
	try {
		const faculty = await Faculty.findById(req.params.id)
		const user = await User.findById(user_id)
		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				message: "User not found",
			})
		}

		faculty.marketingCoordinatorId = user_id
		await faculty.save()

		return res.status(StatusCodes.OK).json({
			message: "Add marketing coordinator successed",
			data: faculty,
		})
	} catch (error) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

// get all faculties
const getAllFaculties = async (req, res) => {
	try {
		const faculties = await Faculty.find()
			.populate("marketingCoordinatorId", "name")
			.sort({
				createdAt: -1,
			})

		res.status(StatusCodes.OK).json({
			faculties,
		})
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
	}
}

//get a faculties
const getFacultyById = async (req, res) => {
	try {
		const faculty = await Faculty.findById(req.params.id)

		if (!faculty) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "Faculty not found!",
			})
		}

		return res.status(StatusCodes.OK).json(faculty)
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
	}
}

const editFaculty = async (req, res) => {
	const { name, marketingCoordinatorId } = req.body

	try {
		const faculty = await Faculty.findById(req.params.id)

		if (!faculty) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "Faculty not found!",
			})
		}

		// Find marketing coordiator and remove the faculty id
		if (marketingCoordinatorId) {
			const newCoordinator = await User.findById(marketingCoordinatorId)

			if (!newCoordinator) {
				return res.status(StatusCodes.NOT_FOUND).json({
					error: "Marketing coordinator id not found!",
				})
			}

			if (
				marketingCoordinatorId.toString() ==
				faculty.marketingCoordinatorId.toString()
			) {
				return res.status(StatusCodes.CONFLICT).json({
					error: "New marketing coordinator id is the same as the old one!",
				})
			}

			if (newCoordinator.facultyId) {
				return res.status(StatusCodes.CONFLICT).json({
					error: "New marketing coordinator is already in a faculty!",
				})
			}

			// upda the faculty id of the newCoordinator
			await User.updateOne(
				{
					_id: marketingCoordinatorId,
				},
				{
					facultyId: req.params.id,
				}
			)

			// remove the faculty id if the currentCoordinator
			await User.updateOne(
				{
					_id: faculty.marketingCoordinatorId,
				},
				{
					facultyId: null,
				}
			)
		}

		const editFaculty = await Faculty.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			}
		)

		return res.status(StatusCodes.OK).json({
			editFaculty,
		})
	} catch (error) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

const deleteFaculty = async (req, res) => {
	try {
		const { id } = req.params

		const faculty = await Faculty.findById(id)

		if (!faculty) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "Faculty not found!",
			})
		}

		// check if there are any students inside the faculty
		const students = await User.find({
			facultyId: id,
		})

		if (students.length > 0) {
			return res.status(StatusCodes.NOT_ACCEPTABLE).json({
				error:
					"Cannot delete faculty as there are students inside this faculty!",
			})
		}

		await Faculty.findByIdAndDelete(req.params.id, req.body)
		await User.findByIdAndUpdate(faculty.marketingCoordinatorId, {
			facultyId: null,
		})

		return res.status(StatusCodes.OK).send("Delete faculty succeesfully")
	} catch (error) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

module.exports = {
	editFaculty,
	getAllFaculties,
	createFaculty,
	deleteFaculty,
	getFacultyById,
	addMarketingCoordinator,
}
