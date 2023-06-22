const express = require('express');
const passport = require('passport');

const router = express.Router();
// console.log('router loaded');
const homeController = require('../controllers/home_controller');

const adminController = require('../controllers/admin_controller');

router.get("/dashboard", adminController.dashboard); //Delete this
router.get("/addstudent", adminController.addstudent);
router.post('/createstudent', adminController.createstudent);
router.get("/addteacher", adminController.addteacher);
router.post('/createteacher', adminController.createteacher);
router.get("/allotsubject", adminController.allotsubject);
router.post('/searchteacherid', adminController.searchteacherid);
router.post('/addsubject', adminController.addsubject); 
router.get('/deletesubject', adminController.deletesubject); 
router.get('/calendar', adminController.calendar); 


module.exports = router;