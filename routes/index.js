const express = require('express');
const passport = require('passport');
// const microsoftStrategy = require('passport-microsoft').Strategy;


const router = express.Router();


const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);
router.get('/Login', homeController.Login);
router.get('/forgotpassword', homeController.fp_forgotpassword);
router.post('/forgotpassword/email', homeController.fp_mail);
router.post("/forgotpassword/verify", homeController.verifyotp);
router.post("/forgotpassword/password", homeController.fp_password);
router.get('/nexus', homeController.nexus);
// router.get('/otp', homeController.fp_opt);
// router.get('/password', homeController.fp_password);
  //Delete this
router.get('/error', homeController.error); 

router.use('/admin', require("./admins"))
router.use('/examcell', require("./examcell"))
router.use('/feecell', require("./feecell"))
router.use('/teacher', require("./teachers"))
router.use('/student', require("./students"))
router.get('/auth/microsoft', passport.authenticate('microsoft'));
router.get('/auth/microsoft/redirect', passport.authenticate('microsoft', { failureRedirect: '/login' }), homeController.micin);

router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/Login' },
), homeController.createSession);

router.get('/sign-out', homeController.destroySession);

module.exports = router;