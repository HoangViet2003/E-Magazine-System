const { Faculty } = require("../models")
const { User } = require("../models")
const { StatusCodes } = require("http-status-codes")
const { validateData } = require("../validations/validation")

const createFaculty = async (req, res) => {
	const { name } = req.body
	try {
		const newFaculty = await Faculty.create({
			name,
		})

		return res.status(StatusCodes.CREATED).json({
			message: "create new faculty",
			data: newFaculty,
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
		faculty.marketingCoordinatorId = _id
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
		// const {_Id}  = req.value.params;
		// const faculty = await Faculty.findById(_Id);
		const faculties = await Faculty.find()
		res.status(StatusCodes.OK).json({
			message: "Get list faculties",
			data: faculties,
		})
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
	}
}

//get a faculties
const getAFaculties = async (req, res) => {
	try {
		const faculty = await Faculty.findById(req.params.id)
		res.status(StatusCodes.OK).json(faculty)
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
	}
}

const editFaculty = async (req, res) => {
	const { error, value } = validateData(req.body)
	if (error) {
		console.log(error)
		return res.send(error.details)
	}

	try {
		const editFaculty = await Faculty.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		)
		return res.status(StatusCodes.OK).json({
			status: "edit successed",
			data: editFaculty,
		})
		// res.send(editFaculty);
	} catch (error) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

const deleteFaculty = async (req, res) => {
	try {
		await Faculty.findByIdAndDelete(req.params.id, req.body)
		return res.status(StatusCodes.OK).send("delete Faculty succeesful")
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
	getAFaculties,
	addMarketingCoordinator,
}
