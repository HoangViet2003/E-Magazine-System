const dbSequelize = require("../models/sequelize");

const Student = dbSequelize.students;

const addStudent = async (req, res) => {
    const { FacultyId, Name, Email, Password } = req.body;
    try {
        const student = await Student.create({
            FacultyId,
            Name,
            Email,
            Password,
        });
        return res.status(201).json(student);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll();
        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addStudent,
    getAllStudents,
}