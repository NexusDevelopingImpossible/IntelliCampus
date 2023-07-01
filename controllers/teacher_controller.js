const checkurlfunct = require("./server-function");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timetable");
const Student = require("../models/student");
const Attendance = require("../models/attendance");
const MarksScheme = require("../models/marksScheme");
const Notification = require("../models/notification");
const prettydate = require("pretty-date");


//Dashboard
module.exports.dashboard = async (req, res) => {
  try {
    checkurlfunct.checkurlteacher(req, res);
    let teacherdata = await Teacher.findOne({
      username: res.locals.user.username,
    });
    let timetabledata = await Timetable.find({
      teacherid: teacherdata._id,
    }).populate("subjectcode");
    let notidata = await Notification.find({}).sort({updatedAt: -1});
    let arr = [];
    for(let i = 0; i<notidata.length; i++){
      const dd = prettydate.format(notidata[i].updatedAt);
      arr.push(dd);
    }
    // console.log(arr);
    return res.render("teacher/dashboard", {
      title: "Dashboard",
      teacher: teacherdata,
      timetable: timetabledata, notidata, arr
    });
  } catch (err) {
    console.log(err);
  }
};

//Allot subject to student page
module.exports.allotsubject = async (req, res) => {
  try {
    checkurlfunct.checkurlteacher(req, res);
    let teacherdata = await Teacher.findOne({
      username: res.locals.user.username,
    });
    let timetabledata = await Timetable.find({
      teacherid: teacherdata._id,
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
          updateattendance: Date.now(),
          updateinternal: Date.now(),
          exitattendance: Date.now(),
          exitinternal: Date.now()
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
    const timetables = await Timetable.findOne({ _id: req.params.id }).populate(
      "subjectcode"
    );
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
    const newdateId = dateadd.classes[dateadd.classes.length - 1]._id;
    // console.log(newdateId);
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
        date: newdateId,
        att: attvalue,
        datevalue: req.body.date,
      };
      data.present.push(newpresent);
      data.updateattendance = Date.now();
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
  const timetables = await Timetable.findById(req.params.id).populate(
    "subjectcode"
  );
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
  const timetables = await Timetable.findById(req.params.id).populate(
    "subjectcode"
  );
  const data = await Attendance.find({ timetableid: timetables._id }).populate(
    "timetableid studentid"
  );
  data.sort();
  const date = false;
  return res.render("teacher/subject/attendance-update", {
    title: "Attendance",
    timetable: timetables,
    student: data,
    date: date,
  });
};

module.exports.attendaceedit = async (req, res) => {
  
  const timetables = await Timetable.findOne({
    "classes._id": req.params.id,
  }).populate("subjectcode");
  const data = await Attendance.find({ timetableid: timetables._id }).populate(
    "timetableid studentid"
  );
  const date = timetables.classes.find((number) => number._id == req.params.id);

  for (let i = 0; i < data.length; i++) {
    const askeddate = data[i].present.find(
      (number) => number.date == req.params.id
    );
    data[i].present = [];
    data[i].present.push(askeddate);
  }
  data.sort();
  return res.render("teacher/subject/attendance-update", {
    title: "Attendance",
    timetable: timetables,
    student: data,
    date: date,
  });
};

//view attendance of single student
module.exports.viewstudentattendance = async (req, res) => {
  try {
   
    let data = await Attendance.findById(req.params.id).populate(
      "timetableid studentid"
    );
    const timetables = await Timetable.findById(data.timetableid._id).populate(
      "subjectcode"
    );

    data.present.sort();
    console.log(timetables);
    return res.render("teacher/subject/attendanceviewsingle", {
      title: "Attendance",
      student: data,
      timetable: timetables,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.change_attendance = async (req, res) => {
  try {
    let check = req.body.check;
    for (let i = 0; i < req.body.studentlist.length; i++) {
      let attvalue = false;
      let tp = 0;
      for (let j = 0; j < check.length; j++) {
        if (check[j] == i) {
          attvalue = true;
          break;
        }
      }
      let pastdata = await Attendance.findOne({_id: req.body.studentlist[i]});
      const date = pastdata.present.find((number) => number.date == req.body.date);
      if(!date.att && attvalue){
        tp = 1;
      }
      if(date.att && !attvalue){
        tp = -1;
      }
      tp = tp + pastdata.totalpresent;
      await Attendance.updateOne(
        { _id: req.body.studentlist[i], "present.date": req.body.date },
        {
          $set: {
            "present.$.att": attvalue,
            totalpresent: tp,
            updateattendance: Date.now()
          },
        }
      );
    }
    return res.redirect("back");
  } catch (err) {
    console.log(err);
  }
};

module.exports.internalmarkspage = async (req, res) => {
  let timetabledata = await Timetable.findById(req.params.id).populate(
    "subjectcode"
  );
  let marksData = await MarksScheme.findOne({ timeTableId: req.params.id });
  let data = await Attendance.find({ timetableid: req.params.id }).populate(
    "timetableid studentid"
  );
  marksData = JSON.stringify(marksData);
  // console.log(window.screen.height);
  return res.render("teacher/subject/internalmarks", {
    title: "Internal marks",
    timetable: timetabledata,
    marksData: marksData,
    student: data,
  });
};

module.exports.updateMarks = async (req, res) => {
  console.log(req.body);
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
