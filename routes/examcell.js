const express = require('express');
const passport = require('passport');

const router = express.Router();

const examcellController = require('../controllers/examcell_controller');

router.get("/dashboard", examcellController.dashboard);
router.get("/cgpa", examcellController.cgpa);
router.post("/cgpa/adddata", examcellController.addcgpa);
router.get("/cgpa/search", examcellController.searchcgpa);
router.get("/lockinternal", examcellController.lockinternal);
router.post("/lockinternal/lock", examcellController.lockinternal_lock);
router.get("/subject", examcellController.createsubject);
router.post("/subject/addsubject", examcellController.addsubject);
router.get("/subject/search", examcellController.searchsub);
router.get("/subject/delete", examcellController.deletesub);
router.get("/cform", examcellController.cform);
router.get("/setting", examcellController.setting);
router.post("/changepassword", examcellController.changepassword);

module.exports = router;