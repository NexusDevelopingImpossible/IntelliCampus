const express = require('express');
const passport = require('passport');

const router = express.Router();

const examcellController = require('../controllers/examcell_controller');

router.get("/dashboard", examcellController.dashboard);

module.exports = router;