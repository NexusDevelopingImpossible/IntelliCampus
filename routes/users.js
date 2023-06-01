const express = require('express');
const passport = require('passport');

const router = express.Router();
// console.log('router loaded');
const homeController = require('../controllers/home_controller');

const userController = require('../controllers/user_controller');

router.get('/', homeController.home);
router.get('/Login', userController.Login)
router.post('/create', userController.create);

router.get('/signup', userController.signUp) //Delete this
router.get("/temp" ,userController.temp); //Delete this
router.get("/student" ,userController.student); //Delete this
router.get("/teacher" ,userController.teacher); //Delete this
router.get("/admin" ,userController.admin); //Delete this

router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/users/Login' },
), userController.createSession);

router.get('/sign-out', userController.destroySession);

module.exports = router;