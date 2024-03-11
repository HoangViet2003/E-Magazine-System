const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils");
const argon2 = require("argon2");
const dbSequelize = require("../models/sequelize");

const Student = dbSequelize.students;
const Staff = dbSequelize.staff;
const Guest = dbSequelize.guest;


//sign up for student and staff
const signUp = catchAsync(async (req, res) => {
	try{
        const { Name, Email, Password: plainTextPassword, Role } = req.body;

	const Password = await argon2.hash(plainTextPassword);

	const existingStaff = await Staff.findOne({ where: {Email: Email } });
	const existingStudent = await Student.findOne({ where: {Email: Email } });

	if (existingStaff || existingStudent) {
		return res.status(400).send({
			status: "error",
			message: "Email already exists",
		});
	}

	// Create a new user if the email does not exist
	let newUser;
	if (Role) {
		newUser = await Staff.create({ Name, Email, Password, Role });
	} else if (!Role) {
		newUser = await Student.create({ Name, Email, Password });
	} else {
		return res.status(400).send({
			status: "error",
			message: "Invalid Role",
		});
	}

	const access_token = jwt.sign(
		{ Id: newUser.Id, Email: newUser.Email },
		process.env.JWT_SECRET,
		{ expiresIn: "1d" }
	);

	const refresh_token = jwt.sign(
		{ Id: newUser.Id, Email: newUser.Email },
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
    }catch(err){
        return res.send({
            status: "error",
            message: err.message,
        });
    
    }
});

//login function
const login = catchAsync(async (req, res) => {
    try{
        const { Email, Password } = req.body;

	//check if email and password are provided
	if (!Email || !Password) {
		return res.status(400).send({
			status: "error",
			message: "Email and Password are required",
		});
	}

	const existingStaff = await Staff.findOne({ where: { Email } });
	const existingStudent = await Student.findOne({ where: { Email } });

	if (!existingStudent && !existingStaff) {
		return res.status(400).send({
			status: "error",
			message: "Email or password is incorrect",
		});
	}

    const user = existingStaff || existingStudent;
    const isPasswordValid = await argon2.verify(user.Password, Password);
    if (!isPasswordValid) {
        return res.status(400).send({
            status: "error",
            message: "Email or password is incorrect",
        });
    }

    const access_token = jwt.sign(
        { Id: user.Id, Email: user.Email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    const refresh_token = jwt.sign(
        { Id: user.Id, Email: user.Email },
        process.env.JWT_SECRET
    );
    

	
	res.status(200).send({
		status: "success",
		message: "Logged in successfully",
		user,
		token: {
			access_token,
			refresh_token,
			expires_in: "1d",
		},
	});
    }catch(err){
        return res.send({
            status: "error",
            message: err.message,
        });
    }
	
});

module.exports = {
	signUp,
	login,
};
