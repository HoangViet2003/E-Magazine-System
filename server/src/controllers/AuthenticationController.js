const jwt = require("jsonwebtoken")
const { catchAsync } = require("../utils")
const argon2 = require("argon2")
const { User, Faculty } = require("../models")

//sign up for student and staff
const register = catchAsync(async (req, res) => {
	try {
		const {
			name,
			email,
			password: plainTextPassword,
			role,
			facultyId,
		} = req.body

		//check if email and password,Role are provided
		if (!email || !plainTextPassword || !role || !name) {
			return res.status(400).send({
				status: "error",
				message: "Email, Password and Role are required",
			})
		}

		if (
			["marketing coordinator", "student", "guest"].includes(role) &&
			!facultyId
		) {
			return res.status(400).send({
				status: "error",
				message: "Faculty ID is required for this role",
			})
		}

		const password = await argon2.hash(plainTextPassword)

		const userExists = await User.findOne({ email })

		if (userExists) {
			return res.status(400).send({
				status: "error",
				message: "Email already exists",
			})
		}

		// Create a new user if the email does not exist
		let newUser
		if (["marketing coordinator", "student", "guest"].includes(role)) {
			newUser = await User.create({
				name,
				email,
				password,
				role,
				facultyId,
			})
			if (role === "marketing coordinator") {
				const faculty = await Faculty.findOne({ _id: facultyId })
				faculty.marketingCoordinatorId = newUser._id
				await faculty.save()
			}
		} else {
			newUser = await User.create({
				name,
				email,
				password,
				role,
			})
		}

		const access_token = jwt.sign(
			{ _id: newUser._id, email: newUser.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		)

		const refresh_token = jwt.sign(
			{ _id: newUser._id, email: newUser.email },
			process.env.JWT_SECRET
		)

		res.status(201).send({
			message: "User created successfully",
			user: newUser,
			token: {
				access_token,
				refresh_token,
				expires_in: "1d",
			},
		})
	} catch (err) {
		return res.send({
			status: "error",
			message: err.message,
		})
	}
})

//login function
const login = catchAsync(async (req, res) => {
	try {
		const { email, password } = req.body

		//check if email and password are provided
		if (!email || !password) {
			return res.status(400).send({
				status: "error",
				message: "Email and Password are required",
			})
		}

		const user = await User.findOne({ email })

		if (!user) {
			return res.status(400).send({
				status: "error",
				message: "Email or password is incorrect",
			})
		}

		const isPasswordValid = await argon2.verify(user.password, password)
		if (!isPasswordValid) {
			return res.status(400).send({
				status: "error",
				message: "Email or password is incorrect",
			})
		}

		const access_token = jwt.sign(
			{ _id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		)

		const refresh_token = jwt.sign(
			{ _id: user._id, email: user.email },
			process.env.JWT_SECRET
		)

		res.status(200).send({
			status: "success",
			message: "Logged in successfully",
			user,
			token: {
				access_token,
				refresh_token,
				expires_in: "1d",
			},
		})
	} catch (err) {
		return res.send({
			status: "error",
			message: err.message,
		})
	}
})

const confirmResetPassowrd = async (req, res) => {
	try {
	} catch (error) {
		return res.status(500).json({
			error: error.message,
		})
	}
}

const forgotPassword = catchAsync(async (req, res) => {
	try {
		const { email } = req.body

		// send email with password reset link
	} catch (error) {
		console.error(error)
		return res.status(500).send({
			message: "Internal server error",
		})
	}
})

module.exports = {
	register,
	login,
}
