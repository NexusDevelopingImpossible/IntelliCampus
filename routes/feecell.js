const express = require('express');
const passport = require('passport');

const router = express.Router();

const feecellController = require('../controllers/feecell_controller');

router.get("/dashboard", feecellController.dashboard);
router.post("/dashboard/adddata", feecellController.addfeepending);
router.get("/dashboard/search", feecellController.searchstud);
router.get("/setting", feecellController.setting);
router.post("/changepassword", feecellController.changepassword);

module.exports = router;