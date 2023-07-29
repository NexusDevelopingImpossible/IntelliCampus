const checkurlfunct = require("./server-function");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timetable");
const Student = require("../models/student");
const Attendance = require("../models/attendance");
const Notification = require("../models/notification");
const teachersProfile = require("../models/teacherprofile");
const TG = require("../models/tg");
const prettydate = require("pretty-date");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const User = require("../models/user");

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
    let notidata = await Notification.find({}).sort({ updatedAt: -1 });
    let arr = [];
    for (let i = 0; i < notidata.length; i++) {
      const dd = prettydate.format(notidata[i].updatedAt);
      arr.push(dd);
    }
    // console.log(arr);
    return res.render("teacher/dashboard", {
      title: "Dashboard",
      teacher: teacherdata,
      timetable: timetabledata,
      notidata,
      arr,
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
    console.log(timetabledata.subjectcode.type == "Theroy");
    if (timetabledata.subjectcode.type == "Theory") {
      if (timetabledata.subjectcode.theorytype == "Core") {
        let studentdata = await Student.find({
          department: timetabledata.department,
          semester: timetabledata.semester,
          section: timetabledata.section,
        });
        // console.log(timetabledata, studentdata);
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
            exitinternal: Date.now(),
            examMarks: [
              { Quiz1: "" },
              { Session1: "" },
              { Quiz2: "" },
              { Session2: "" },
            ],
          });
        }
      }
      if (timetabledata.subjectcode.theorytype == "Elective") {
        let studentdata = await Student.find({
          department: timetabledata.department,
          semester: timetabledata.semester,
        });
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
            exitinternal: Date.now(),
            examMarks: [
              { Quiz1: "" },
              { Session1: "" },
              { Quiz2: "" },
              { Session2: "" },
            ],
          });
        }
      }
    }
    if (timetabledata.subjectcode.type == "Lab") {
      let studentdata = await Student.find({
        department: timetabledata.department,
        semester: timetabledata.semester,
        section: timetabledata.section,
      });
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
          exitinternal: Date.now(),
          examMarks: [
            { Final: "" },
          ],
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
    const timetables = await Timetable.findOne({ _id: req.params.id }).populate(
      "subjectcode"
    );
    const data = await Attendance.find({
      timetableid: timetables._id,
    }).populate("timetableid studentid");
    data.sort((a, b) => {
      const studentIdA = a.studentid.username;
      const studentIdB = b.studentid.username;

      return studentIdA - studentIdB;
    });
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
    let dataA = await Attendance.find({ timetableid: req.body.id }).populate(
      "studentid"
    );
    for (let i = 0; i < req.body.studentlist.length; i++) {
      let data = dataA.find((item) => item._id == req.body.studentlist[i]);
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
    // const dataA = await Attendance.find({ timetableid: req.body.id }).populate('studentid');
    if (req.xhr) {
      return res.status(200).json({
        data: {
          student: dataA,
        },
      });
    }
    // req.flash("success", "Attendance added successfully");
    // return res.redirect("back");
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
      let pastdata = await Attendance.findOne({ _id: req.body.studentlist[i] });
      const date = pastdata.present.find(
        (number) => number.date == req.body.date
      );
      if (!date.att && attvalue) {
        tp = 1;
      }
      if (date.att && !attvalue) {
        tp = -1;
      }
      tp = tp + pastdata.totalpresent;
      await Attendance.updateOne(
        { _id: req.body.studentlist[i], "present.date": req.body.date },
        {
          $set: {
            "present.$.att": attvalue,
            totalpresent: tp,
            updateattendance: Date.now(),
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
  // let marksData = await MarksScheme.findOne({ timeTableId: req.params.id });
  let data = await Attendance.find({ timetableid: req.params.id }).populate(
    "studentid"
  );
  // marksData = JSON.stringify(marksData);
  console.log(timetabledata.internalmarks);
  return res.render("teacher/subject/internalmarks", {
    title: "Internal marks",
    timetable: timetabledata,
    // marksData: marksData,
    student: data,
  });
};

// notes
module.exports.viewnotes = async (req, res) => {
  try {
    checkurlfunct.checkurlteacher(req, res);
    const timetables = await Timetable.findOne({ _id: req.params.id }).populate(
      "subjectcode"
    );
    return res.render("teacher/subject/notes", {
      title: "Notes",
      timetable: timetables,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.profile = async (req, res) => {
  try {
    console.log(req.params.registration);
    const studentdata = await Student.findOne({
      username: req.params.registration,
    });
    if (!studentdata) {
      req.flash("error", "Incorrect registraion number");
      return res.redirect("back");
    }
    return res.render("student/profile", {
      title: "Profile",
      student: studentdata,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.uploadnote = async (req, res) => {
  try {
    let note = Timetable.uploadfile(req, res, function (error) {
      if (error) {
        console.log("** Multer error:", error);
      }
      console.log(req.file);
      let subjectdata = Timetable.findById();
      const note = {};
      const file = Timetable.uploadpath + "/" + req.file.filename;
      const type = req.body.type;
      const chapter = req.body.chapter;
      note.push(file);
      note.push(type);
      note.push(chapter);
      subjectdata.notes.push(note);
      subjectdata.save();
      return res.redirect("back");
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.res_analysis = async (req, res) => {
  try {
    return res.render("teacher/result-analytics", { title: "Result Analysis" });
  } catch (error) {
    console.log(error);
  }
};
module.exports.allot_students = async (req, res) => {
  try {
    return res.render("teacher/teach-allot-students", {
      title: "Allot Students",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.allot = async (req, res) => {
  try {
    return res.render("teacher/allotsubjectform", { title: "Allot Students" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.assignment_check = async (req, res) => {
  try {
    let timetabledata = await Timetable.findById(req.params.id).populate(
      "subjectcode"
    );
    return res.render("teacher/subject/assignment_check", {
      title: "Assignment Check",
      timetable: timetabledata,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.setting = async (req, res) => {
  try {
    let teacherdata = await teachersProfile.findOne(
      { regnNo: res.locals.user.username },
      { _id: 0, hidephoneno: 1, hidewhatsappno: 1 }
    );
    console.log(teacherdata);
    return res.render("teacher/setting", { title: "Setting", teacherdata });
  } catch (error) {
    console.log(error);
  }
};
module.exports.changepassword = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.newpassword === req.body.new1password) {
      let user = await User.findById(res.locals.user._id);
      if (user.password === req.body.oldpassword) {
        user.password = req.body.new1password;
        await user.save();
        req.flash("success", "Password Updated");
      } else {
        req.flash("error", "Old password did not match");
      }
    } else {
      req.flash("error", "New and Confirm password did not match");
    }
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
module.exports.settingupdate = async (req, res) => {
  try {
    if (req.body.hidephoneno == undefined) {
      req.body.hidephoneno = "off";
    }
    if (req.body.hidewhatsappno == undefined) {
      req.body.hidewhatsappno = "off";
    }
    let teacherdata = await teachersProfile.findOneAndUpdate(
      { regnNo: res.locals.user.username },
      {
        hidephoneno: req.body.hidephoneno,
        hidewhatsappno: req.body.hidewhatsappno,
      }
    );
    await teacherdata.save();
    if (req.xhr) {
      return res.status(200);
    }
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports.profile = async (req, res) => {
  try {
    let teacher = await Teacher.findOne({
      username: res.locals.user.username,
    });
    let timetabledata = await Timetable.find({
      teacherid: teacher._id,
    }).populate("subjectcode");
    let existingTeacherProfile;
    // console.log(res.locals.user.username);
    existingTeacherProfile = await teachersProfile.findOne({
      regnNo: res.locals.user.username,
    });
    let tgdata = await TG.find({ teacherid: teacher._id }).populate(
      "studentid"
    );
    return res.render("teacher/profile-teach", {
      title: "Teacher Profile",
      teacher,
      timetabledata,
      tgdata,
      teacherdata: existingTeacherProfile,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.updateProfile = async (req, res) => {
  try {
    let createdProfile;
    teachersProfile.uploadedFiles(req, res, async function (error) {
      if (error) {
        console.log("**** Multer error :", error);
      } else {
        let regnNo = req.body.regnNo;
        let existingTeacherProfileUpdate =
          await teachersProfile.findOneAndUpdate({ regnNo: regnNo }, req.body);
        if (existingTeacherProfileUpdate) {
        } else {
          await teachersProfile.create(req.body);
        }
      }
      async function load_file() {
        if (req.file) {
          let existingTeacherProfile;
          existingTeacherProfile = await teachersProfile.findOne({
            regnNo: res.locals.user.username,
          });
          // console.log(req.body.regnNo);
          let teacher = await Teacher.findOne({
            username: res.locals.user.username,
          });
          // console.log(teacher)
          if (existingTeacherProfile.avatar) {
            fs.unlinkSync(
              path.join(__dirname, "..", existingTeacherProfile.avatar)
            );
          }
          teacher.avatar = teachersProfile.filePath + "/" + req.file.filename;
          existingTeacherProfile.avatar =
            teachersProfile.filePath + "/" + req.file.filename;
          await existingTeacherProfile.save();
          await teacher.save();
        }
      }
      await load_file();
      return res.redirect("back");
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.json({ Error: error });
  }
};

module.exports.int_resetmaxmarks = async (req, res) => {
  try {
    console.log(req.body);
    examType = req.body.examType;
    let timetabledata = await Timetable.findById(req.body.timetableid);
    if (timetabledata) {
      let intarr = timetabledata.internalmarks;
      let examObject = intarr.find((item) => examType in item);
      const index = intarr.indexOf(examObject);
      if (examObject) {
        timetabledata.internalmarks[index][examType] = req.body.maxMarks;
        timetabledata.markModified("internalmarks");
        let s = await timetabledata.save();
      } else {
        let examt;
        if (examType == "Quiz1") {
          examt = { Quiz1: req.body.maxMarks };
        }
        if (examType == "Quiz2") {
          examt = { Quiz2: req.body.maxMarks };
        }
        if (examType == "Session1") {
          examt = { Session1: req.body.maxMarks };
        }
        if (examType == "Session2") {
          examt = { Session2: req.body.maxMarks };
        }
        if (examType == "Final") {
          examt = { Quiz1: req.body.maxMarks };
        }
        timetabledata.internalmarks.push(examt);
        let t = await timetabledata.save();
      }
    }
    if (req.xhr) {
      return res.status(200).json({
        data: timetabledata.internalmarks,
      });
    }
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
module.exports.int_updateinternal = async (req, res) => {
  try {
    console.log(req.body);
    let examType = req.body.examtype;
    let student = req.body.student;
    let timetableid;
    // console.log(attendance);
    for (let i = 0; i < student.length; i++) {
      let stud_int = await Attendance.findById(student[i]);
      timetableid = stud_int.timetableid;
      let intarr = stud_int.examMarks;
      console.log(intarr);
      let examObject = intarr.find((item) => examType in item);

      const index = intarr.indexOf(examObject);
      if (examObject) {
        stud_int.examMarks[index][examType] = req.body.marks[i];
        stud_int.markModified("examMarks");
      } else {
        let examt;
        console.log(examType);
        if (examType == "Quiz1") {
          examt = { Quiz1: req.body.marks[i] };
          stud_int.examMarks.push(examt);
        }
        if (examType == "Quiz2") {
          examt = { Quiz2: req.body.marks[i] };
          stud_int.examMarks.push(examt);
        }
        if (examType == "Session1") {
          examt = { Session1: req.body.marks[i] };
          stud_int.examMarks.push(examt);
        }
        if (examType == "Session2") {
          examt = { Session2: req.body.marks[i] };
          stud_int.examMarks.push(examt);
        }
        // await stud_int.save();
        console.log("saved");
      }
      await stud_int.save();
    }
    let data = await Attendance.find({ timetableid: timetableid }).populate(
      "studentid"
    );
    if (req.xhr) {
      return res.status(200).json({
        student: data,
      });
    }
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
