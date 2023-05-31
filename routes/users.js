const express = require('express');

const router = express.Router();
// console.log('router loaded');
const homeController = require('../controllers/home_controller');

const userController = require('../controllers/user_controller');

router.get('/', homeController.home);
router.get('/Login', userController.Login)

module.exports = router;