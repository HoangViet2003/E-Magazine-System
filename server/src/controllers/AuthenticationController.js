const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils");
const argon2 = require("argon2");
const { User} = require("../models");
const {validateUser} = require('../validations/validation');

//sign up for student and staff
const register = catchAsync(async (req, res) => {

		try {
		const { name, email, password: plainTextPassword, role } = req.body;
		// const {error, value} =  validateUser(req.body); 
	    // if(error) {
	    //     console.log(error); 
	    //     return res.send(error.details); 
	    //  }

		//check if email and password,Role are provided
		if (!email || !plainTextPassword || !role || !name) {
			return res.status(400).send({
				status: "error",
				message: "Email, Password and Role are required",
			});
		}

		const password = await argon2.hash(plainTextPassword);

		const userExists = await User.findOne({ email } );

		if (userExists) {
			return res.status(400).send({
				status: "error",
				message: "Email already exists",
			});
		}

		// Create a new user if the email does not exist
		let newUser;
		newUser = await User.create({
			name,
			email,
			password,
			role,
		});
		

		const access_token = jwt.sign(
			{ _id: newUser._id, email: newUser.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		const refresh_token = jwt.sign(
			{ _id: newUser._id, email: newUser.email },
			process.env.JWT_SECRET
		);

		res.status(201).send({
			status: "success",
			message: "User created successfully",
			user: newUser,
			token: {
				access_token,
				refresh_token,
				expires_in: "1d",
			},
		});
	} catch (err) {
		return res.send({
			status: "error",
			message: err.message,
		});
	}
});

//login function
const login = catchAsync(async (req, res) => {
	try {
		const { email, password } = req.body;

		//check if email and password are provided
		if (!email || !password) {
			return res.status(400).send({
				status: "error",
				message: "Email and Password are required",
			});
		}

		const user = await User.findOne({email});

		if (!user) {
			return res.status(400).send({
				status: "error",
				message: "Email or password is incorrect",
			});
		}

		const isPasswordValid = await argon2.verify(user.password, password);
		if (!isPasswordValid) {
			return res.status(400).send({
				status: "error",
				message: "Email or password is incorrect",
			});
		}

		const access_token = jwt.sign(
			{ _id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		const refresh_token = jwt.sign(
			{ _id: user._id, email: user.email },
			process.env.JWT_SECRET
		);

		res.status(200).send({
			status: "success",
			message: "Logged in successfully",
			user,
			token: {
				access_token,
				refresh_token,
				expires_in: "30d",
			},
		});
	} catch (err) {
		return res.send({
			status: "error",
			message: err.message,
		});
	}
});

module.exports = {
	register,
	login,
};
