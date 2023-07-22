const express = require('express');
const passport = require('passport');

const router = express.Router();

const examcellController = require('../controllers/examcell_controller');

router.get("/dashboard", examcellController.dashboard);
router.get("/cgpa", examcellController.cgpa);
router.post("/cgpa/adddata", examcellController.addcgpa);
router.get("/lockinternal", examcellController.lockinternal);
router.get("/subject", examcellController.createsubject);
router.post("/subject/addsubject", examcellController.addsubject);
router.get("/subject/search", examcellController.searchsub);
router.get("/subject/delete/:id", examcellController.deletesub);
router.get("/cform", examcellController.cform);

module.exports = router;