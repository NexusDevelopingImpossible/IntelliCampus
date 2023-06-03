const express = require('express');
const passport = require('passport');

const router = express.Router();
// console.log('router loaded');
const homeController = require('../controllers/home_controller');

const teacherController = require('../controllers/teacher_controller');

router.get("/dashboard", teacherController.dashboard); //Delete this



module.exports = router;