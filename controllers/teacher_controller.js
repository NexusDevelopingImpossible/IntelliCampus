const checkurlfunct = require("./server-function");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timetable");
const Student = require("../models/student");
const Attendance = require("../models/attendance");
const Notification = require("../models/notification");
const Calendar = require("../models/calendar");
const teachersProfile = require("../models/teacherprofile");
const TG = require("../models/tg");
const Subjectnotes = require("../models/notes");
const Assignment = require("../models/assignment");
const prettydate = require("pretty-date");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const User = require("../models/user");
const AttendanceGrant = require("../models/attendancegrant");
const studentAssignment = require("../models/studentassignment");
const Feedback = require("../models/feedback");
const { Console } = require("console");

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
    let calendardata = await Calendar.find({});
    // console.log(arr);
    return res.render("teacher/dashboard", {
      title: "Dashboard",
      teacher: teacherdata,
      timetable: timetabledata,
      notidata,
      arr,
      calendardata,
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

module.exports.subjectstudentlist = async (req, res) => {
  try {
    checkurlfunct.checkurlteacher(req, res);
    let timetabledata = await Timetable.findOne({
      _id: req.params.id,
    }).populate("subjectcode");
    let studentlist = [];
    if (timetabledata.subjectcode.theorytype == "Core") {
      let studentdata = await Student.find({
        department: timetabledata.department,
        semester: timetabledata.semester,
        section: timetabledata.section,
      });
      for (let i = 0; i < studentdata.length; i++) {
        let attcheck = await Attendance.findOne({
          studentid: studentdata[i]._id,
          timetableid: timetabledata._id,
        });
        if (!attcheck) {
          studentlist.push(studentdata[i]);
        }
      }
      return res.render("teacher/teach-allot-students", {
        title: "Allot Subject to Student",
        timetable: timetabledata,
        studentlist: studentlist,
      });
    }

    if (timetabledata.subjectcode.theorytype == "Elective") {
      let studentdata = await Student.find({
        department: timetabledata.department,
        semester: timetabledata.semester,
      });
      for (let i = 0; i < studentdata.length; i++) {
        let attcheck = await Attendance.findOne({
          studentid: studentdata[i]._id,
          timetableid: timetabledata._id,
        });
        if (!attcheck) {
          studentlist.push(studentdata[i]);
        }
      }
      return res.render("teacher/teach-allot-students", {
        title: "Allot Subject to Student",
        timetable: timetabledata,
        studentlist: studentlist,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.allotsubjectsearchadd = async (req, res) => {
  try {
    checkurlfunct.checkurlteacher(req, res);
    let reg = req.body.registration;
    let student = await Student.findOne({ username: reg });
    if (req.xhr) {
      return res.status(200).json({
        student: student,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
//Searching the student in the student database to allot subject
module.exports.allotsubjectaddstudent = async (req, res) => {
  checkurlfunct.checkurlteacher(req, res);
  try {
    if (typeof req.body.studentlist == "object") {
      let studentdata = req.body.studentlist;
      if (studentdata) {
        let timetabledata = await Timetable.findById(
          req.body.timetableid
        ).populate("subjectcode");
        if (timetabledata.subjectcode.type == "Theory") {
          for (let i = 0; i < studentdata.length; i++) {
            let check = await Attendance.findOne({
              timetableid: timetabledata._id,
              studentid: studentdata[i],
            });
            if (!check) {
              await Attendance.create({
                timetableid: timetabledata._id,
                studentid: studentdata[i],
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
          for (let i = 0; i < studentdata.length; i++) {
            let check = await Attendance.findOne({
              timetableid: timetabledata._id,
              studentid: studentdata[i],
            });
            if (!check) {
              await Attendance.create({
                timetableid: timetabledata._id,
                studentid: studentdata[i],
                present: [],
                totalpresent: 0,
                examMarks: [],
                updateattendance: Date.now(),
                updateinternal: Date.now(),
                exitattendance: Date.now(),
                exitinternal: Date.now(),
                examMarks: [{ Final: "" }],
              });
            }
          }
        }
        req.flash("success", "Subject allot to students successfully");
      }
    }
    if (typeof req.body.studentlist == "string") {
      let studentdata = req.body.studentlist;
      if (studentdata) {
        let timetabledata = await Timetable.findById(
          req.body.timetableid
        ).populate("subjectcode");
        if (timetabledata.subjectcode.type == "Theory") {
          let check = await Attendance.findOne({
            timetableid: timetabledata._id,
            studentid: studentdata,
          });
          if (!check) {
            await Attendance.create({
              timetableid: timetabledata._id,
              studentid: studentdata,
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
                { Assignment: "" },
              ],
            });
          }
        }
        if (timetabledata.subjectcode.type == "Lab") {
          let check = await Attendance.findOne({
            timetableid: timetabledata._id,
            studentid: studentdata,
          });
          if (!check) {
            await Attendance.create({
              timetableid: timetabledata._id,
              studentid: studentdata,
              present: [],
              totalpresent: 0,
              examMarks: [],
              updateattendance: Date.now(),
              updateinternal: Date.now(),
              exitattendance: Date.now(),
              exitinternal: Date.now(),
              examMarks: [{ Final: "" }],
            });
          }
        }
        req.flash("success", "Subject allot to students successfully");
      }
    }
    return res.redirect("back");
  } catch (err) {
    console.log(err);
  }
};

// //attendance page
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
    const allnotes = await Subjectnotes.findOne({
      subjectid: timetables.subjectcode._id,
    });
    const notes = allnotes.notes.filter((book) => book.type === "Notes");
    const pyqs = allnotes.notes.filter((book) => book.type === "pyqs");
    const samplepapers = allnotes.notes.filter(
      (book) => book.type === "samplepapers"
    );
    const videos = allnotes.notes.filter((book) => book.type === "video");
    return res.render("teacher/subject/notes", {
      title: "Notes",
      timetable: timetables,
      allnotes,
      notes,
      pyqs,
      samplepapers,
      videos,
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
    Subjectnotes.uploadedFiles(req, res, async function (error) {
      if (error) {
        console.log("**** Multer error :", error);
      } else {
        const timestamp = Date.now();
        const currentDate = new Date(timestamp);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const tdate = day + "-" + month + "-" + year;
        let subjectcheck = await Subjectnotes.findOne({
          subjectid: req.body.subjectid,
        });
        console.log(subjectcheck);
        if (subjectcheck) {
          for (let i = 0; i < req.files.length; i++) {
            let notedata = {
              name: req.files[i].originalname,
              path: Subjectnotes.filePath + "/" + req.files[i].filename,
              chapter: req.body.chapter,
              filesize: (req.files[i].size / 1024).toFixed(0),
              uploaddate: tdate,
              type: req.body.type,
            };
            subjectcheck.notes.push(notedata);
          }
          subjectcheck.save();
        } else {
          let filearr = [];
          for (let i = 0; i < req.files.length; i++) {
            let notedata = {
              name: req.files[i].originalname,
              path: Subjectnotes.filePath + "/" + req.files[i].filename,
              chapter: req.body.chapter,
              filesize: (req.files[i].size / 1024).toFixed(0),
              uploaddate: tdate,
              type: req.body.type,
            };
            filearr.push(notedata);
          }
          Subjectnotes.create({
            subjectid: req.body.subjectid,
            notes: filearr,
          });
        }
        console.log(req.files.length);
      }
      async function load_file() {
        console.log(req.files);
        console.log(req.body);

        if (req.files) {
          let files = req.files;
          console.log("Hi:", files);
        }
      }
      await load_file();
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
          if (
            existingTeacherProfile.avatar &&
            existingTeacherProfile.avatar != "/images/account.svg"
          ) {
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
        if (examType == "Assignment") {
          examt = { Assignment: req.body.maxMarks };
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
    let examType = req.body.examtype;
    let student = req.body.student;
    let timetableid;
    for (let i = 0; i < student.length; i++) {
      let stud_int = await Attendance.findById(student[i]);
      timetableid = stud_int.timetableid;
      let intarr = stud_int.examMarks;
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
        if (examType == "Assignment") {
          examt = { Assignment: req.body.marks[i] };
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
module.exports.assignment = async (req, res) => {
  let timetabledata = await Timetable.findById(req.params.id).populate(
    "subjectcode"
  );
  let assignmentdata = await Assignment.find({
    timetableid: timetabledata._id,
  });
  console.log(assignmentdata);
  return res.render("teacher/subject/assignment", {
    title: "Assignment",
    timetable: timetabledata,
    assignmentdata,
  });
};
module.exports.assignmentcreate = async (req, res) => {
  try {
    Assignment.uploadedFiles(req, res, async function (error) {
      if (error) {
        console.log("**** Multer error :", error);
      } else {
      }
      async function load_file() {
        if (req.file) {
          await Assignment.create({
            timetableid: req.body.timetableid,
            title: req.body.title,
            description: req.body.description,
            pdfpath: Assignment.filePath + "/" + req.file.filename,
            duedate: req.body.duedate,
            status: "notgraded",
          });
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
module.exports.assignmentmark = async (req, res) => {
  const assignmentdata = await Assignment.findById(req.params.id);
  const timetable = await Timetable.findById(
    assignmentdata.timetableid
  ).populate("subjectcode");
  const studentassignment = await studentAssignment
    .find({ assignmentid: assignmentdata._id })
    .populate("studentid");
  const attendanceList = await Attendance.find({
    timetableid: timetable._id,
  }).populate("studentid");
  let arrnot = [];
  for (let i = 0; i < attendanceList.length; i++) {
    attendanceList[i].studentid.avatar = "";
    for (let j = 0; j < studentassignment.length; j++) {
      if (
        String(attendanceList[i].studentid._id) ===
          String(studentassignment[j].studentid._id) &&
        String(assignmentdata._id) === String(studentassignment[j].assignmentid)
      ) {
        let studassignment = {
          name: attendanceList[i].studentid.name,
          registration: attendanceList[i].studentid,
          submitted: true,
          file: studentassignment[j].pdfpath,
          dateupload: studentassignment[j].updatedAt,
        };
        arrnot.push(studassignment);
      } else {
        let studassignment = {
          name: attendanceList[i].studentid.name,
          registration: attendanceList[i].studentid,
          file: "",
          dateupload: "",
        };
        arrnot.push(studassignment);
      }
    }
    if (studentassignment.length === 0) {
      let studassignment = {
        name: attendanceList[i].studentid.name,
        registration: attendanceList[i].studentid,
        file: "",
        dateupload: "",
      };
      arrnot.push(studassignment);
    }
  }
  return res.render("teacher/subject/assignment_check", {
    title: "Assignment",
    timetable,
    assignmentdata,
    arrnot,
  });
};
module.exports.assignmentupdatemark = async (req, res) => {
  try {
    let timetabledata = await Timetable.findById(req.body.timetableid);
    let studentlist = req.body.student;
    let marks = req.body.marks;
    for (let i = 0; i < studentlist.length; i++) {
      let assignsingle = await studentAssignment.findOneAndUpdate(
        {
          studentid: studentlist[i],
          assignmentid: req.body.assignmentid,
        },
        { marks: marks[i] },
        {
          new: true,
          runValidators: true,
        }
      );
      let assigninternal = await Attendance.findOneAndUpdate(
        { studentid: studentlist[i], timetableid: timetabledata._id },
        { assignmentmarks: marks[i] + assignmentmarks },
        {
          new: true,
          runValidators: true,
        }
      );
    }
    return res.redirect("back");
  } catch (error) {}
};
module.exports.attendancegrant = async (req, res) => {
  try {
    checkurlfunct.checkurlteacher(req, res);
    let assignmentgrant = await AttendanceGrant.find({}).sort({
      updatedAt: -1,
    });
    res.render("teacher/attendancegrant", {
      title: "Assignment Grant",
      assignmentgrant,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.feedback = async (req, res) => {
  try {
    let timetabledata = await Timetable.findById(req.params.id).populate(
      "subjectcode"
    );
    let assignmentdata = await Assignment.find({
      timetableid: timetabledata._id,
    });

    let feedbackdata = await Feedback.find({ timetableid: timetabledata._id });
    const feedarr = new Array(9);

    for (let i = 0; i < 9; i++) {
      feedarr[i] = new Array(5).fill(0);
    }
    for (let i = 0; i < feedbackdata.length; i++) {
      console.log(feedbackdata[i].feedback[0]);
      {
        if (feedbackdata[i].feedback[0] == 1) {
          feedarr[0][0] = feedarr[0][0] + 1;
        }
        if (feedbackdata[i].feedback[0] == 2) {
          feedarr[0][1] = feedarr[0][1] + 1;
        }
        if (feedbackdata[i].feedback[0] == 3) {
          feedarr[0][2] = feedarr[0][2] + 1;
        }
        if (feedbackdata[i].feedback[0] == 4) {
          feedarr[0][3] = feedarr[0][3] + 1;
        }
        if (feedbackdata[i].feedback[0] == 5) {
          feedarr[0][4] = feedarr[0][4] + 1;
        }
      }
      {
        if (feedbackdata[i].feedback[1] == 1) {
          feedarr[1][0] = feedarr[1][0] + 1;
        }
        if (feedbackdata[i].feedback[1] == 2) {
          feedarr[1][1] = feedarr[1][1] + 1;
        }
        if (feedbackdata[i].feedback[1] == 3) {
          feedarr[1][2] = feedarr[1][2] + 1;
        }
        if (feedbackdata[i].feedback[1] == 4) {
          feedarr[1][3] = feedarr[1][3] + 1;
        }
        if (feedbackdata[i].feedback[1] == 5) {
          feedarr[1][4] = feedarr[1][4] + 1;
        }
      }
      {
        if (feedbackdata[i].feedback[2] == 1) {
          feedarr[2][0] = feedarr[2][0] + 1;
        }
        if (feedbackdata[i].feedback[2] == 2) {
          feedarr[2][1] = feedarr[2][1] + 1;
        }
        if (feedbackdata[i].feedback[2] == 3) {
          feedarr[2][2] = feedarr[2][2] + 1;
        }
        if (feedbackdata[i].feedback[2] == 4) {
          feedarr[2][3] = feedarr[2][3] + 1;
        }
        if (feedbackdata[i].feedback[2] == 5) {
          feedarr[2][4] = feedarr[2][4] + 1;
        }
      }
      {
        if (feedbackdata[i].feedback[3] == 1) {
          feedarr[3][0] = feedarr[3][0] + 1;
        }
        if (feedbackdata[i].feedback[3] == 2) {
          feedarr[3][1] = feedarr[3][1] + 1;
        }
        if (feedbackdata[i].feedback[3] == 3) {
          feedarr[3][2] = feedarr[3][2] + 1;
        }
        if (feedbackdata[i].feedback[3] == 4) {
          feedarr[3][3] = feedarr[3][3] + 1;
        }
        if (feedbackdata[i].feedback[3] == 5) {
          feedarr[3][4] = feedarr[3][4] + 1;
        }
      }
      {
        if (feedbackdata[i].feedback[4] == 1) {
          feedarr[4][0] = feedarr[4][0] + 1;
        }
        if (feedbackdata[i].feedback[4] == 2) {
          feedarr[4][1] = feedarr[4][1] + 1;
        }
        if (feedbackdata[i].feedback[4] == 3) {
          feedarr[4][2] = feedarr[4][2] + 1;
        }
        if (feedbackdata[i].feedback[4] == 4) {
          feedarr[4][3] = feedarr[4][3] + 1;
        }
        if (feedbackdata[i].feedback[4] == 5) {
          feedarr[4][4] = feedarr[4][4] + 1;
        }
      }
      {
        if (feedbackdata[i].feedback[5] == 1) {
          feedarr[5][0] = feedarr[5][0] + 1;
        }
        if (feedbackdata[i].feedback[5] == 2) {
          feedarr[5][1] = feedarr[5][1] + 1;
        }
        if (feedbackdata[i].feedback[5] == 3) {
          feedarr[5][2] = feedarr[5][2] + 1;
        }
        if (feedbackdata[i].feedback[5] == 4) {
          feedarr[5][3] = feedarr[5][3] + 1;
        }
        if (feedbackdata[i].feedback[5] == 5) {
          feedarr[5][4] = feedarr[5][4] + 1;
        }
      }
      {
        if (feedbackdata[i].feedback[6] == 1) {
          feedarr[6][0] = feedarr[6][0] + 1;
        }
        if (feedbackdata[i].feedback[6] == 2) {
          feedarr[6][1] = feedarr[6][1] + 1;
        }
        if (feedbackdata[i].feedback[6] == 3) {
          feedarr[6][2] = feedarr[6][2] + 1;
        }
        if (feedbackdata[i].feedback[6] == 4) {
          feedarr[6][3] = feedarr[6][3] + 1;
        }
        if (feedbackdata[i].feedback[6] == 5) {
          feedarr[6][4] = feedarr[6][4] + 1;
        }
      }
      {
        if (feedbackdata[i].feedback[7] == 1) {
          feedarr[7][0] = feedarr[7][0] + 1;
        }
        if (feedbackdata[i].feedback[7] == 2) {
          feedarr[7][1] = feedarr[7][1] + 1;
        }
        if (feedbackdata[i].feedback[7] == 3) {
          feedarr[7][2] = feedarr[7][2] + 1;
        }
        if (feedbackdata[i].feedback[7] == 4) {
          feedarr[7][3] = feedarr[7][3] + 1;
        }
        if (feedbackdata[i].feedback[7] == 5) {
          feedarr[7][4] = feedarr[7][4] + 1;
        }
      }
      {
        if (feedbackdata[i].feedback[8] == 1) {
          feedarr[8][0] = feedarr[8][0] + 1;
        }
        if (feedbackdata[i].feedback[8] == 2) {
          feedarr[8][1] = feedarr[8][1] + 1;
        }
        if (feedbackdata[i].feedback[8] == 3) {
          feedarr[8][2] = feedarr[8][2] + 1;
        }
        if (feedbackdata[i].feedback[8] == 4) {
          feedarr[8][3] = feedarr[8][3] + 1;
        }
        if (feedbackdata[i].feedback[8] == 5) {
          feedarr[8][4] = feedarr[8][4] + 1;
        }
      }

    }
    return res.render("teacher/subject/feedback", {
      title: "Feedback",
      timetable: timetabledata,
      feedbackdata,
      feedarr,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.attendancegrantadd = async (req, res) => {
  try {
    let teacher = await Teacher.findOne({ username: res.locals.user.username });
    if (teacher) {
      AttendanceGrant.uploadedFiles(req, res, async function (error) {
        if (error) {
          console.log("**** Multer error :", error);
        } else {
        }
        async function load_file() {
          if (req.file) {
            await AttendanceGrant.create({
              enteredby: teacher.name,
              subject: req.body.subject,
              pdfpath: AttendanceGrant.filePath + "/" + req.file.filename,
            });
          }
        }
        await load_file();
        return res.redirect("back");
      });
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    res.json({ Error: error });
  }
};
