const router = require("express").Router();
const { FacultyController } = require("../controllers");
const middleware = require("../middlewares/authenticate");
// const {validateParam, schemas} = require('../validations/validation')

router.post("/faculty", FacultyController.createFaculty);
router.get("/faculties",  FacultyController.getAllFaculties);
router.get("/faculty/:id", FacultyController.getAFaculties);
router.patch("/faculty/:id", FacultyController.editFaculty); 
router.delete("/faculty/:id", middleware.authenticateAdministrator, FacultyController.deleteFaculty); 

// router.post("/faculty",facultyValidation.createNew);


module.exports = router;
