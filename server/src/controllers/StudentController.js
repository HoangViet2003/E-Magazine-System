// const { User } = require('../models');
// // const {validateUser} = require('../validations/userValidate');

// const addStudent = async (req, res) => {

//     const { facultyId, name, email, password,role } = req.body;
//     try {
//         const user = await User.create({
//             facultyId,
//             name,
//             email,
//             password,
//             role

//         });

//         return res.status(201).json(user);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };


// const getAllStudents = async (req, res) => {
//     try {
//         const users = await User.find();
//         return res.status(200).json(users);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };


// module.exports = {
//     addStudent,
//     getAllStudents,
// }