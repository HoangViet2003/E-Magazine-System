const {Faculty} = require('../models');
const {catchAsync} = require('../utils');


//create faculty
const createFaculty = catchAsync(async (req, res) => {
    const { name, marketingCoordinatorId} = req.body;
    try {
        const faculty = await Faculty.create({
            name,
            marketingCoordinatorId
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
    createFaculty,
    getAllFaculties
}