const jwt = require("jsonwebtoken")
const { catchAsync } = require("../utils")
const argon2 = require("argon2")
const { User, Faculty } = require("../models")
const ejs = require("ejs")
const path = require("path")
const { handleSendEmail } = require("../utils/sendMail")
const { KeyObject } = require("crypto")

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

const confirmResetPassword = async (req, res) => {
	try {
		const user = await User.findOne({
			email: req.body.email,
		})

		if (!user) {
			return res.status(404).json({
				error: "User with this email does not exist",
			})
		}

		const secret = process.env.JWT_SECRET

		const token = jwt.sign(
			{
				_id: user._id,
				email: user.email,
			},
			secret,
			{
				expiresIn: "15m",
			}
		)

		const url = "https://localhost:3000/reset-password/" + token

		await ejs.renderFile(
			path.join(
				__dirname,
				"..",
				"emails",
				"authentication",
				"resetPasswordConfirmation.email.ejs"
			),
			{ url },
			async (err, html) => {
				if (err) throw err

				await handleSendEmail({
					to: req.body.email,
					subject: "Reset your password",
					html,
				})
			}
		)

		return res.status(500).send({
			message:
				"Email sent successfully. The email with reset password link has been sent to your email.",
		})
	} catch (error) {
		return res.status(500).json({
			error: error.message,
		})
	}
}

const resetPassword = catchAsync(async (req, res) => {
	try {
		const { token } = req.query

		const { oldPassword, newPassword } = req.body

		if (!token) {
			return res.status(400).send({ error: "Token is not provided" })
		}

		const payload = jwt.verify(token, process.env.JWT_SECRET)
		if (!payload) {
			return res.status(400).send({ error: "Invalid token" })
		}

		// check if the old password is correct
		const user = await User.findById(payload._id)
		if (!(await argon2.verify(user.password, oldPassword))) {
			return res.status(400).send({ error: "Incorrect old password" })
		}

		// update the user password
		const newHashPassword = await argon2.hash(newPassword)
		user.password = newHashPassword
		await user.save()

		return res.status(200).json({
			message: "Reset password for user successfully",
		})
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
	confirmResetPassword,
	resetPassword,
}
