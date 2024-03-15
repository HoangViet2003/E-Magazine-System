// const dbSequelize = require("../models/sequelize");

// const Faculty = dbSequelize.faculty;

// //creatContribution. get contribution, search contribution
// const createFaculty = async (req, res) => {
//     const { Name, StaffId} = req.body;
//     try {
//         const faculty = await Faculty.create({
//             Name, 
//             StaffId
//         });
//         return res.status(201).json(faculty);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };


// // const getAllStudents = async (req, res) => {
// //     try {
// //         const students = await Student.findAll();
// //         return res.status(200).json(students);
// //     } catch (error) {
// //         return res.status(500).json({ error: error.message });
// //     }
// // };

// module.exports = {
//     createFaculty
//     // getAllStudents,
// }