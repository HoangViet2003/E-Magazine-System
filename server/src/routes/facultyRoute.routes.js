const router = require("express").Router();
const { FacultyController } = require("../controllers");

router.post("/faculty", FacultyController.createFaculty);
router.get("/faculty", FacultyController.getAllFaculties);

module.exports = router;
