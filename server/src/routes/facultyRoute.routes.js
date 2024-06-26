const router = require("express").Router()
const { FacultyController } = require("../controllers")
const {
	authenticateToken,
	authenticateStudent,
	authenticateMarketingCoordinator,
	authenticateAdministrator,
} = require("../middlewares/authenticate")

// const {validateParam, schemas} = require('../validations/validation')

router.post(
	"/faculty",
	authenticateToken,
	authenticateAdministrator,
	FacultyController.createFaculty
)
router.get("/faculties", authenticateToken, FacultyController.getAllFaculties)
router.get("/faculty/:id", FacultyController.getFacultyById)
router.patch("/faculty/:id", FacultyController.editFaculty)
router.patch(
	"/faculty/:id/add-marketing-coordinator",
	FacultyController.addMarketingCoordinator
)
router.delete(
	"/faculty/:id",
	authenticateToken,
	authenticateAdministrator,
	FacultyController.deleteFaculty
)

// router.post("/faculty",facultyValidation.createNew);

module.exports = router
