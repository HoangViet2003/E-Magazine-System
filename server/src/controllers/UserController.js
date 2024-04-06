const { User, Faculty } = require("../models")
const { hash } = require("argon2")

const getAllUsers = async (req, res) => {
	try {
		const { page } = req.query

		const users = await User.find()
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
		if (role === "student") {
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

		// create faculty if the role is marketing coordinator
		if (role == "marketing coordinator") {
			const newFaculty = new Faculty({
				name: "Blank Faculty Name",
				marketingCoordinatorId: newUser._id,
			})

			await newFaculty.save()
		}

		return res.status(201).json({ newUser })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

// const editUser = async (req, res) => {
// 	const { error, value } = validateUser(req.body)
// 	if (error) {
// 		console.log(error)
// 		return res.send(error.details)
// 	}
//
// 	try {
// 		const editUser = await User.findByIdAndUpdate(req.params.id, req.body, {
// 			new: true,
// 		})
// 		return res.status(200).json({
// 			status: "edit user successed",
// 			data: editUser,
// 		})
// 	} catch (error) {
// 		return res.status(500).json({ error: error.message })
// 	}
// }

const deleteUser = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id, req.body)
		return res.status(200).send("delete user succeesful")
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

module.exports = { getAllUsers, createUser, deleteUser }
