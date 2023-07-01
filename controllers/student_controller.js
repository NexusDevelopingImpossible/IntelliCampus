const checkurlfunct = require("./server-function");
const Student = require("../models/student");
const Attendance = require("../models/attendance");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timetable");
const Calendar = require("../models/calendar");
const Notification = require("../models/notification");
const prettydate = require("pretty-date");
const { ConnectionStates } = require("mongoose");


module.exports.dashboard = async (req, res) => {
  try {
    checkurlfunct.checkurlstudent(req, res);
    const studentdata = await Student.findOne({
      username: res.locals.user.username,
    }).populate({ path: "pinned", populate: { path: "noti" } });
    const internal = await Attendance.find({
      studentid: studentdata._id
    }).populate({ path: "timetableid", populate: { path: "subjectcode" } });
    console.log(internal);
    let calendardata = await Calendar.find({});
    calendardata = JSON.stringify(calendardata);
    let notidata = await Notification.find({}).sort({updatedAt: -1});
    let arr = [];
    for(let i = 0; i<notidata.length; i++){
      const dd = prettydate.format(notidata[i].updatedAt);
      arr.push(dd);
    }
    // req.locals.int = internal;

    return res.render("Student/dashboard", {
      title: "Dashboard",
      student: studentdata,
      internal, calendardata, notidata, arr
    });
  } catch (err) {
    console.log(err);
  } 
};
module.exports.pinnoti = async (req, res) => {
  try {
    let notiarray = await Student.findOne({
      username: res.locals.user.username,
    }).populate({ path: "pinned", populate: { path: "noti" } });;
    const index = notiarray.pinned.findIndex(obj => obj.noti._id == req.params.id);
    if(index == -1){
      const newnoti = {
        noti: req.params.id
      }
      notiarray.pinned.push(newnoti);
      notiarray.save();
      let notiLength=notiarray.pinned.length;
      const newNotiId = notiarray.pinned[notiLength-1]._id;

      return res.status(200).json({ newNotiId });
    }
    return res.redirect('back');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports.unpinnoti = async (req, res) => {
  try {
    let student = await Student.findOne({
      username: res.locals.user.username,
    }).populate({ path: "pinned", populate: { path: "noti" } });
    console.log(req.params.id)
    const index = student.pinned.findIndex(obj => obj._id == req.params.id);
    console.log(index)
    if (index !== -1) {
      student.pinned.splice(index, 1);
      await student.save();
    }
    return res.redirect('back');
  } catch (error) {
    
  }
}

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
    let subject
    let attendancesingle;
    console.log(attendance);
    return res.render("student/attendance_view", {
      title: "Attendance",
      attendance, attendancesingle,
      subject: subject,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.attendancesingle = async (req, res) => {
  try {
    checkurlfunct.checkurlstudent(req, res);
    const studentdata = await Student.findOne({
      username: res.locals.user.username,
    });
    const attendancesingle = await Attendance.findByIdAndUpdate(req.params.id).populate({
      path: "timetableid",
      populate: { path: "subjectcode" },
    });
    attendancesingle.exitattendance = Date.now();
    await attendancesingle.save();
    const attendance = await Attendance.find({
      studentid: studentdata._id,
    }).populate({ path: "timetableid", populate: { path: "subjectcode" } });
    attendancesingle.present.sort((a, b) => {
      const dateA = new Date(a.datevalue);
      const dateB = new Date(b.datevalue);
      return dateA.getTime() - dateB.getTime();
    });
    let subject = attendancesingle.timetableid.subjectcode;
    return res.render("student/attendance_view", {
      title: "Attendance",
      attendance, attendancesingle,
      subject: subject
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.enter_feedback = async (req, res) => {
  try {
    const teacherdata = await Teacher.findById(req.params.id);

    return res.render("student/feedback_response", { title: "Submit Feedback", teacherdata });
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
