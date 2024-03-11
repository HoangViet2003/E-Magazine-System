const jwt = require("jsonwebtoken");
const { Student, Staff, Guest } = require("../models");

const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token)
		return res.status(403).send({
			status: "error",
			message: "Invalid token",
		});

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
		if (err) return res.sendStatus(403);

		const staff = await Staff.findById(user.Id);
		const guest = await Guest.findById(user.Id);
		const student = await Student.findById(user.Id);

		if (staff) {
			req.user = staff;
		} else if (guest) {
			req.user = guest;
		} else if (student) {
			req.user = student;
		}

		next();
	});
};

const authenticateMarketingCoordinator = async (req, res, next) => {
	//Check if user is a marketing coordinator
      if (!req.user.Role || req.user.Role !== "Marketing Coordinator") {
				return res.status(403).send({
					status: "error",
					message: "You are not allowed to perform this action",
				});
			}
			next();
    }


const authenticateMarketingManager = async (req, res, next) => {
    //Check if user is a marketing manager
      if (!req.user.Role || req.user.Role !== "Marketing Manager") {
                return res.status(403).send({
                    status: "error",
                    message: "You are not allowed to perform this action",
                });
            }
            next();
    }

const authenticateAdministrator = async (req, res, next) => {
    //Check if user is an administrator
      if (!req.user.Role || req.user.Role !== "Administrator") {
                return res.status(403).send({
                    status: "error",
                    message: "You are not allowed to perform this action",
                });
            }
            next();
}




module.exports = {
	authenticateToken,
    authenticateMarketingCoordinator,
    authenticateMarketingManager,
    authenticateAdministrator,
};
