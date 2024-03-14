// const dbSequelize = require("../models/sequelize");

// const Staff = dbSequelize.staffs;

// const addStaff = async (req, res) => {
//     const {  Name, Email, Password, Role } = req.body;
//     try {
//         const staff = await Staff.create({
//             Name,
//             Email,
//             Password,
//             Role,
//         });
//         return res.status(201).json(staff);
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
//     addStaff
// }