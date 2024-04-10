const { User, Faculty } = require("../models")
const { hash } = require("argon2")

const getAllUsers = async (req, res) => {
	try {
		const { page } = req.query

		const users = await User.find()
			.sort({
				createdAt: -1,
			})
			.limit(5)
			.skip((page - 1) * 5)

		return res.status(200).json(users)
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const createUser = async (req, res) => {
	try {
		const {
			name,
			email,
			password: plainTextPassword,
			role,
			facultyId,
		} = req.body

		// if role == student or marketing coordinator, facultyId is required
		if (
			role === "student" ||
			role === "marketing coordinator" ||
			role === "guest"
		) {
			if (!facultyId) {
				return res.status(400).json({ error: "facultyId is required" })
			}

			// check if facultyId exists
			const faculty = await Faculty.findById(facultyId)



			if (!faculty) {
				return res.status(400).json({ error: "facultyId does not exist" })
			}
		}

		const password = await hash(plainTextPassword)

		const newUser = new User({
			name,
			email,
			password,
			role,
			facultyId,
		})
		await newUser.save()

		if (role === "marketing coordinator") {
			await Faculty.findByIdAndUpdate(facultyId, {
				marketingCoordinatorId: newUser._id,
			})
		}

		return res.status(201).json({ newUser })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const editUser = async (req, res) => {
	try {
		const editedUser = await User.findById(req.params.id)

		if (!editedUser) {
			return res.status(400).json({
				error: "User not found!",
			})
		}

		const editUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		})

		return res.status(200).json({
			editUser,
		})
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const deleteUser = async (req, res) => {
	try {
		const deletedUser = await User.findById(req.params.id)

		if (!deletedUser) {
			return res.status(400).json({
				error: "User not found!",
			})
		}

		if (deletedUser.role == "marketing coordinator") {
			// remove the marketing coordinator id from the faculty of the coordinator
			await Faculty.findOneAndUpdate(
				{
					marketingCoordinatorId: deletedUser._id,
				},
				{
					marketingCoordinatorId: null,
				}
			)
		}

		await User.findByIdAndDelete(req.params.id, req.body)

		return res.status(200).send("Delete user successfully")
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

module.exports = { getAllUsers, createUser, editUser, deleteUser }
