const express = require("express");
const passport = require("passport");

const router = express.Router();

const adminController = require("../controllers/admin_controller");

router.get("/dashboard", adminController.dashboard); //Delete this
router.get("/addstudent", adminController.addstudent);
router.post("/addstudent/createstudent", adminController.createstudent);
router.post(
  "/addstudent/createstudentWexcel",
  adminController.createstudentWexcel
);
router.get("/addteacher", adminController.addteacher);
router.post(
  "/addteacher/createteacherWexcel",
  adminController.createteacherWexcel
);
router.post("/addteacher/createteacher", adminController.createteacher);
router.get("/signup", adminController.signUp);
router.post("/create", adminController.create);
router.get("/allotsubject", adminController.allotsubject);
router.get("/searchteacherid/:id", adminController.searchteacherid);
router.get("/searchbaralotsubject/:id", adminController.searchbaralotsubject);
router.post("/addsubject", adminController.addsubject);
router.get("/deletesubject", adminController.deletesubject);
router.get("/calendar", adminController.calendar);
router.post("/addholiday", adminController.addholiday);
router.get("/notification", adminController.notification);
router.post("/createnoti", adminController.createnoti);
router.get("/allottg", adminController.allottg);
router.get("/allottg-std", adminController.allottg_std);
router.get("/department", adminController.dept);
router.get("/program", adminController.program);
router.post("/adddepartment", adminController.adddept);
router.post("/addprogram", adminController.addprogram);
router.get("/searchprogram/:id", adminController.searchprogram);
router.get("/deleteprogram/:id", adminController.deleteprogram);
router.get("/deletedepartment/:id", adminController.deletedepartment);
router.get("/tgsearch/:id", adminController.tgsearch);
router.post("/addward", adminController.addward);
router.get("/addward/delete/:id", adminController.addwarddelete);
router.get("/spotsearch/:id", adminController.spotsearch);
router.get("/setting", adminController.setting);
router.post("/changepassword", adminController.changepassword);
router.get("/semester", adminController.semester);
router.post("/createsem", adminController.createsem);
router.get("/semestercourse/:id", adminController.semestercourse);
router.get("/studentprofile/:id", adminController.adminstudentprofile);
router.get("/teacherprofile/:id", adminController.adminteacherprofile);
router.get("/deactivate", adminController.deactivate);
router.get("/deactivate/search", adminController.deactivatesearch);
router.post("/deactivate/account", adminController.deactivateaccount);
router.get("/activate", adminController.activate);
router.get("/activate/search", adminController.activatesearch);
router.post("/activate/account", adminController.activateaccount);
router.get("/section", adminController.section);
router.post("/section/addstudent", adminController.addstudentsection);
router.get("/mail", adminController.mail);
router.get("/section/searchstudent", adminController.searchsectionstudent);
router.get("/reports", adminController.reports);
router.get("/feedback", adminController.feedback);
router.post("/feedback/createfeedback", adminController.createfeedback);
router.get("/feedback/resultfeedback/:id", adminController.resultfeedback);
router.post("/feedback/resultfeedback/getdata", adminController.resultfeedackgetdata);
router.get("/attendancegrant", adminController.attendancegrant);
router.post("/attendancegrant/add", adminController.attendancegrantadd);
router.get("/tghome", adminController.tghome);
router.get("/conattendance", adminController.conattendance);
router.post("/conattendance/report", adminController.conattendancereport);
router.get("/feedback/getdata", adminController.tggetdata);
router.get("/tgward", adminController.tgward);
router.get("/tgward/export/:id", adminController.tgwardexport);

module.exports = router;
