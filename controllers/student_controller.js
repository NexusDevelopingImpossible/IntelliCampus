const checkurlfunct = require("./server-function");
const Student = require("../models/student");
const Attendance = require("../models/attendance");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timetable");
const Calendar = require("../models/calendar");

module.exports.dashboard = async (req, res) => {
  try {
    checkurlfunct.checkurlstudent(req, res);
    const studentdata = await Student.findOne({
      username: res.locals.user.username,
    });
    const internal = await Attendance.find({
      studentid: studentdata._id,
    }).populate({ path: "timetableid", populate: { path: "subjectcode" } });
    let calendardata = await Calendar.find({});
    calendardata = JSON.stringify(calendardata);
    return res.render("Student/dashboard", {
      title: "Dashboard",
      student: studentdata,
      internal, calendardata
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.internalmarks = async (req, res) => {
  try {
    checkurlfunct.checkurlstudent(req, res);
    const studentdata = await Student.findOne({
      username: res.locals.user.username,
    });
    const internal = await Attendance.find({
      studentid: studentdata._id,
    }).populate({ path: "timetableid", populate: { path: "subjectcode" } });
    for (let i = 0; i < internal.length; i++) {}
    return res.render("student/internal_marks", {
      title: "Internal Marks",
      student: studentdata,
      internal,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.feedback = async (req, res) => {
  try {
    checkurlfunct.checkurlstudent(req, res);
    const studentdata = await Student.findOne({
      username: res.locals.user.username,
    });
    const attendance = await Attendance.find({
      studentid: studentdata._id,
    }).select('timetableid -_id');
    var teacherdata = [];
    for(let i = 0; i<attendance.length; i++){
      const teacher = await Timetable.findOne({_id: attendance[i].timetableid}).populate(
        "teacherid subjectcode"
      );
      // console.log(teacher);
      teacherdata.push(teacher);
    }
    console.log(teacherdata);
    return res.render("student/feedback", {
      title: "Feedback",
      student: studentdata,
      teacherdata
    });
  } catch (err) {}
};
module.exports.attendance = async (req, res) => {
  try {
    checkurlfunct.checkurlstudent(req, res);
    const studentdata = await Student.findOne({
      username: res.locals.user.username,
    });
    const attendance = await Attendance.find({
      studentid: studentdata._id,
    }).populate({ path: "timetableid", populate: { path: "subjectcode" } });
    let subject;
    console.log(subject);
    return res.render("student/attendance_view", {
      title: "Attendance",
      attendance,
      subject: subject,
    });
  } catch (err) {
    console.log(err);
  }
};

// module.exports.attendancesingle = async (req, res) => {
//   try {
//     checkurlfunct.checkurlstudent(req, res);
//     const studentdata = await Student.findOne({
//       username: res.locals.user.username,
//     });
//     const attendance = await Attendance.find({
//       studentid: studentdata._id,
//     }).populate({ path: "timetableid", populate: { path: "subjectcode" } });
//     const attendancesingle = await Attendance.findById(req.params.id).populate({
//       path: "timetableid",
//       populate: { path: "subjectcode" },
//     });
//     console.log("Att: ",attendance);
//     let subject = attendancesingle.timetableid.subjectcode;
//     return res.render("student/student_attendance_view", {
//       title: "Attendance",
//       attendance, attendancesingle,
//       subject: subject
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

module.exports.enter_feedback = async (req, res) => {
  try {

    return res.render("student/feedback_response", { title: "GIVE FEEDBACK" });
  } catch (Error) {
    console.log(Error);
  }
};

module.exports.feedbackdata = async (req, res) => {
  try {
    req.flash("success", "Feedback submitted.");
    return res.redirect("feedback");
  } catch (error) {
    console.log(error);
  }
};
