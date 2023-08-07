const express = require('express');
const passport = require('passport');

const router = express.Router();
const homeController = require('../controllers/home_controller');

const teacherController = require('../controllers/teacher_controller');
const resultanalysisController = require('../controllers/result_analysis');

router.get("/dashboard", teacherController.dashboard); 

router.get("/allotsubject", teacherController.allotsubject);
router.get('/allotsubject/studentlist/:id', teacherController.subjectstudentlist);
router.get("/getsubject/:id", teacherController.getsubject);
router.post('/allotsubject/addstudent',teacherController.allotsubjectaddstudent);
router.post("/allotsubject/searchadd", teacherController.allotsubjectsearchadd);
router.get("/attendance_view/:id", teacherController.attendance_view);
router.get("/attendance_update/:id", teacherController.attendance_update);
router.get("/viewstudentattendance/:id", teacherController.viewstudentattendance);
router.get("/internalmarks/:id", teacherController.internalmarkspage);
router.get("/attendaceedit/:id", teacherController.attendaceedit);
router.post("/addattendance", teacherController.addattendance);
router.post("/change_attendance", teacherController.change_attendance);
router.get("/notes/:id", teacherController.viewnotes);
router.get("/search/:registration", teacherController.profile);
router.post("/subject/uploadnotes", teacherController.uploadnote);
router.get("/result-analytics", teacherController.res_analysis);
router.get("/view-result-analytics", resultanalysisController.view_res_analysis);
router.get("/teach-allot-students", teacherController.allot_students);
router.get("/allot", teacherController.allot);
router.get("/subject/assignment/:id", teacherController.assignment);
router.post("/subject/assignment/create", teacherController.assignmentcreate);
router.get("/subject/assignment/mark/:id", teacherController.assignmentmark);

router.post("/uploadfile", resultanalysisController.uploadfile);
router.get("/viewstudentattendance", teacherController.viewstudentattendance);
// router.get("/assignmentcheck/:id", teacherController.assignment_check);
router.get("/setting", teacherController.setting);
router.post("/changepassword", teacherController.changepassword);
router.get("/profile", teacherController.profile);
router.post("/updateProfile", teacherController.updateProfile);
router.post("/setting/update", teacherController.settingupdate);

router.post("/internal/resetmaxmarks", teacherController.int_resetmaxmarks);
router.post("/internal/updateinternal", teacherController.int_updateinternal);
router.get("/attendancegrant", teacherController.attendancegrant);
router.post("/attendancegrant/add", teacherController.attendancegrantadd);
module.exports = router;