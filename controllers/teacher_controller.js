const checkurlfunct = require("./server-function");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timetable");
const Student = require("../models/student");
const Attendance = require("../models/attendance");
const MarksScheme = require("../models/marksScheme");

//Dashboard
module.exports.dashboard = async (req, res) => {
  try {
    checkurlfunct.checkurlteacher(req, res);
    let teacherdata = await Teacher.findOne({
      username: res.locals.user.username,
    });
    let timetabledata = await Timetable.find({
      teacherid: res.locals.user.username,
    }).populate("subjectcode");
    return res.render("teacher/dashboard", {
      title: "Dashboard",
      teacher: teacherdata,
      timetable: timetabledata,
    });
  } catch (err) {
    console.log(err);
  }
};

//Allot subject to student page
module.exports.allotsubject = async (req, res) => {
  try {
    checkurlfunct.checkurlteacher(req, res);
    let timetabledata = await Timetable.find({
      teacherid: res.locals.user.username,
    }).populate("subjectcode");
    return res.render("teacher/allotsubject", {
      title: "Allot Subject",
      timetable: timetabledata,
    });
  } catch (err) {
    console.log(err);
  }
};

//Searching the student in the student database to allot subject
module.exports.searchstudent = async (req, res) => {
  checkurlfunct.checkurlteacher(req, res);
  try {
    let timetabledata = await Timetable.findOne({
      _id: req.params.id,
    }).populate("subjectcode");
    let studentdata = await Student.find({
      department: timetabledata.department,
      semester: timetabledata.semester,
      section: timetabledata.section,
    });
    if (timetabledata.subjectcode.type === "Theory") {
      for (let i = 0; i < studentdata.length; i++) {
        await Attendance.create({
          timetableid: timetabledata._id,
          studentid: studentdata[i]._id,
          present: [],
          totalpresent: 0,
          examMarks: [],
        });
      }
    }
    req.flash("success", "Subject allot to students successfully");
    return res.redirect("back");
  } catch (err) {
    console.log(err);
  }
};

//attendance page
module.exports.getsubject = async (req, res) => {
  try {
    checkurlfunct.checkurlteacher(req, res);
    let timeTableCode = req.params.id;
    const timetables = await Timetable.findOne({ _id: req.params.id })
      .populate("subjectcode")
    const data = await Attendance.find({
      timetableid: timetables._id,
    }).populate("timetableid studentid");
    data.sort();

    // let marksData = await MarksScheme.findOne({
    //   timeTableId: timeTableCode,
    // });
    // marksData = JSON.stringify(marksData)

    // let attendanceInfo = await Attendance.find({});
    // let studentInfo = await Student.find({}).sort();
    return res.render("teacher/subject/attendance-add", {
      title: "Attendance",
      timetable: timetables,
      student: data,
      // timeTableCode: timeTableCode,
      // marksData: marksData,
      // attendanceInfo: attendanceInfo,
      // studentInfo: studentInfo,
    });
  } catch (err) {
    console.log(err);
  }
};

//Add new attendance
module.exports.addattendance = async (req, res) => {
  try {
    checkurlfunct.checkurlteacher(req, res);
    const check = req.body.check;
    let dateadd = await Timetable.findById(req.body.id);
    const newdate = { date: req.body.date };
    dateadd.classes.push(newdate);
    dateadd.save();
    // const date = dateadd.classes.find(classObj => classObj.date.equals(req.params.id));
    // console.log(date);
    for (let i = 0; i < req.body.studentlist.length; i++) {
      let data = await Attendance.findById(req.body.studentlist[i]);
      let attvalue = false;
      for (let j = 0; j < check.length; j++) {
        if (check[j] == i) {
          attvalue = true;
          data.totalpresent++;
          break;
        }
      }
      const newpresent = {
        date: req.body.date,
        att: attvalue,
      };
      data.present.push(newpresent);
      data.save();
    }
    req.flash("success", "Attendance added successfully");
    return res.redirect("back");
  } catch (err) {
    console.log(err);
    return;
  }
};
module.exports.attendance_view = async (req, res) => {
  const timetables = await Timetable.findById(req.params.id)
    .populate("subjectcode")
  const data = await Attendance.find({ timetableid: timetables._id }).populate(
    "timetableid studentid"
  );
  data.sort();
  return res.render("teacher/subject/attendance-view", {
    title: "Attendance",
    timetable: timetables,
    student: data,
  });
};

module.exports.attendance_update = async (req, res) => {
  const timetables = await Timetable.findById(req.params.id)
    .populate("subjectcode")
    .exec();
  const data = await Attendance.find({ timetableid: timetables._id }).populate(
    "timetableid studentid"
  );
  data.sort();
  return res.render("teacher/subject/attendance-update", {
    title: "Attendance",
    timetable: timetables,
    student: data,
  });
};

module.exports.attendaceedit = async (req, res) => {
  // console.log(req.params)
  const timetables = await Timetable.findOne({'classes._id':req.params.id})
    .populate("subjectcode")
  const date = timetables.classes.find(classObj => classObj._id.equals(req.params.id));
  console.log(date);
  const data = await Attendance.find({ timetableid: timetables._id }).populate(
    "timetableid studentid"
  );
  // console.log(timetables);
  data.sort();
  return res.render("teacher/subject/attendance-update", {
    title: "Attendance",
    timetable: timetables,
    student: data,
  });
};

//view attendance of single student
module.exports.viewstudentattendance = async (req, res) => {
  try {
    console.log(req.params.id);
    let data = await Attendance.findById(req.params.id).populate(
      "timetableid studentid"
    );
    console.log(data);
    data.present.sort();
    return res.render("teacher/subject/attendanceviewsingle", {
      title: "Attendance",
      student: data,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.internalmarkspage = async (req, res) => {
  let timetabledata = await Timetable.findById(req.params.id).populate(
    "subjectcode"
  );
  let marksData = await MarksScheme.find({ timeTableId: req.params.id });
  let data = await Attendance.find({ timetableid: req.params.id }).populate(
    "timetableid studentid"
  );
  marksData = JSON.stringify(marksData);
  return res.render("teacher/subject/internalmarks", {
    title: "Internal marks",
    timetable: timetabledata,
    marksData: marksData,
    student: data,
  });
};

module.exports.updateMarks = async (req, res) => {
  console.log(req.body)
  let marksInfo = req.body;
  const examType = marksInfo.examType;
  delete marksInfo.examType;
  if (examType == "quiz1") {
    for (let i = 0; i < marksInfo.setMarks.length; i++) {
      let marks = marksInfo.setMarks[i];
      let marksDefault = marksInfo.setDefaultMarks[i];
      let attendanceId = marksInfo.attendanceIdInfo[i];
      let attendanceUserInfo = await Attendance.findByIdAndUpdate(
        attendanceId,
        {
          $set: {
            "examMarks.quiz1": [marks, marksDefault],
          },
        }
      );
    }
  } else if (examType == "quiz2") {
    for (let i = 0; i < marksInfo.setMarks.length; i++) {
      let marks = marksInfo.setMarks[i];
      let marksDefault = marksInfo.setDefaultMarks[i];
      let attendanceId = marksInfo.attendanceIdInfo[i];
      let attendanceUserInfo = await Attendance.findByIdAndUpdate(
        attendanceId,
        {
          $set: {
            "examMarks.quiz2": [marks, marksDefault],
          },
        }
      );
    }
  } else if (examType == "sess1") {
    for (let i = 0; i < marksInfo.setMarks.length; i++) {
      let marks = marksInfo.setMarks[i];
      let marksDefault = marksInfo.setDefaultMarks[i];
      let attendanceId = marksInfo.attendanceIdInfo[i];
      let attendanceUserInfo = await Attendance.findByIdAndUpdate(
        attendanceId,
        {
          $set: {
            "examMarks.sess1": [marks, marksDefault],
          },
        }
      );
    }
  } else if (examType == "sess2") {
    for (let i = 0; i < marksInfo.setMarks.length; i++) {
      let marks = marksInfo.setMarks[i];
      let marksDefault = marksInfo.setDefaultMarks[i];
      let attendanceId = marksInfo.attendanceIdInfo[i];
      let attendanceUserInfo = await Attendance.findByIdAndUpdate(
        attendanceId,
        {
          $set: {
            "examMarks.sess2": [marks, marksDefault],
          },
        }
      );
    }
  }
  res.redirect("back");
};
