const express = require('express');
const passport = require('passport');

const router = express.Router();

const examcellController = require('../controllers/examcell_controller');

router.get("/dashboard", examcellController.dashboard);
router.get("/cgpa", examcellController.cgpa);
router.get("/lockinternal", examcellController.lockinternal);
router.get("/createsubject", examcellController.createsubject);
router.get("/cform", examcellController.cform);

module.exports = router;