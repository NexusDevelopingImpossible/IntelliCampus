const express = require('express');
const passport = require('passport');

const router = express.Router();

const feecellController = require('../controllers/feecell_controller');

router.get("/dashboard", feecellController.dashboard);

module.exports = router;