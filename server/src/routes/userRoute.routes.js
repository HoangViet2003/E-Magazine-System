const router = require("express").Router();
const { StudentController } = require("../controllers");

router.get("/students", StudentController.getAllStudents);
router.post("/student", StudentController.addStudent);

module.exports = router;
