const express = require('express');
const passport = require('passport');

const router = express.Router();
// console.log('router loaded');
const homeController = require('../controllers/home_controller');

const studentController = require('../controllers/student_controller');

router.get("/dashboard", studentController.dashboard);
router.get("/demo", studentController.demo);



module.exports = router;