const { User } = require("../models")
const { validateUser } = require("../validations/validation")

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find()
		return res.status(200).json(users)
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const editUser = async (req, res) => {
	const { error, value } = validateUser(req.body)
	if (error) {
		console.log(error)
		return res.send(error.details)
	}

	try {
		const editUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		})
		return res.status(200).json({
			status: "edit user successed",
			data: editUser,
		})
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const deleteUser = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id, req.body)
		return res.status(200).send("delete user succeesful")
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

module.exports = {
	getAllUsers,
	editUser,
	deleteUser,
}
