const express = require('express');

const router = express.Router();

const timetableController=require('../controllers/timetable_controller');

router.post("/setMaxMarks",timetableController.setMaxMarks)

module.exports = router;