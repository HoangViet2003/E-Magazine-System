const { User } = require('../models');
const { Faculty } = require("../models");
const { catchAsync } = require("../utils");

const addStudent = async (req, res) => {
    const { facultyId, name, email, password,role } = req.body;
    try {
        const user = await User.create({
            facultyId,
            name,
            email,
            password,
            role

        });
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const getAllStudents = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const createFaculty = catchAsync(async (req, res) => {
	const { name, marketingCoordinatorId } = req.body;
	try {
		const faculty = await Faculty.create({
			name,
			marketingCoordinatorId,
		});
		return res.status(201).json(faculty);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

//get all faculties
const getAllFaculties = catchAsync(async (req, res) => {
	try {
		const faculties = await Faculty.find();
		return res.status(200).json(faculties);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

module.exports = {
    addStudent,
    getAllStudents,
}