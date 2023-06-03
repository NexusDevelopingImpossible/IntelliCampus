const express = require('express');
const passport = require('passport');

const router = express.Router();
// console.log('router loaded');
const homeController = require('../controllers/home_controller');

const adminController = require('../controllers/admin_controller');

router.get("/dashboard", adminController.dashboard); //Delete this



module.exports = router;