const express = require('express');
const passport = require('passport');

const router = express.Router();
// console.log('router loaded');
const homeController = require('../controllers/home_controller');

const studentController = require('../controllers/student_controller');

router.get("/dashboard", studentController.dashboard);
router.get("/internalmark", studentController.internalmarks);
router.get("/feedback", studentController.feedback);
router.get("/attendance", studentController.attendance);
router.get("/response/:id", studentController.enter_feedback);
router.get("/attendancesingle/:id", studentController.attendancesingle);
router.post("/feedbackdata", studentController.feedbackdata);
router.get("/pinnoti/:id", studentController.pinnoti);
router.get("/unpinnoti/:id", studentController.unpinnoti);
router.get("/fetchnoti", studentController.fetchnoti);
router.get("/notes", studentController.notes);
router.get("/setting", studentController.setting);
router.post("/changepassword", studentController.changepassword);

module.exports = router;