const checkurlfunct = require("./server-function");
const Student = require("../models/student");
const Attendance = require("../models/attendance");
const Teacher = require("../models/teacher");
const Subject = require("../models/subject");
const Timetable = require("../models/timetable");
const Calendar = require("../models/calendar");
const Notification = require("../models/notification");
const Subjectnotes = require("../models/notes");
const prettydate = require("pretty-date");
const { ConnectionStates } = require("mongoose");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const studentsProfile = require("../models/studentProfile");
const studentreport = require("../models/student_report");
const SemSection = require("../models/semsection");
const Feedback = require("../models/feedback");
const { setTimeout } = require("timers/promises");
const studentAssignment = require("../models/studentassignment");
const Assignment = require("../models/assignment");
const TG = require("../models/tg");

module.exports.dashboard = async (req, res) => {
  try {
    checkurlfunct.checkurlstudent(req, res);
    const studentdata = await Student.findOne({
      username: res.locals.user.username,
    }).populate({ path: "pinned", populate: { path: "noti" } });
    const internal = await Attendance.find({
      studentid: studentdata._id,
    }).populate({ path: "timetableid", populate: { path: "subjectcode" } });
    let calendardata = await Calendar.find({});
    // calendardata = JSON.stringify(calendardata);
    let notidata = await Notification.find({}).sort({ updatedAt: -1 });
    let arr = [];
    for (let i = 0; i < notidata.length; i++) {
      const dd = prettydate.format(notidata[i].updatedAt);
      arr.push(dd);
    }
    // req.locals.int = internal;
    let tg = await TG.findOne({ studentid: studentdata._id }).populate(
      "teacherid"
    );
    return res.render("student/dashboard", {
      title: "Dashboard",
      student: studentdata,
      internal,
      calendardata,
      notidata,
      arr,
      tg
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.pinnoti = async (req, res) => {
  try {
    let notiarray = await Student.findOne({
      username: res.locals.user.username,
    }).populate({ path: "pinned", populate: { path: "noti" } });
    const index = notiarray.pinned.findIndex(
      (obj) => obj.noti._id == req.params.id
    );
    if (index == -1) {
      const newnoti = {
        noti: req.params.id,
      };
      notiarray.pinned.push(newnoti);
      notiarray.save();
      let notiLength = notiarray.pinned.length;
      const newNotiId = notiarray.pinned[notiLength - 1]._id;

      return res.status(200).json({ newNotiId });
    }
    return res.redirect("back");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.unpinnoti = async (req, res) => {
  try {
    let student = await Student.findOne({
      username: res.locals.user.username,
    }).populate({ path: "pinned", populate: { path: "noti" } });
    console.log(req.params.id);
    const index = student.pinned.findIndex((obj) => obj._id == req.params.id);
    console.log(index);
    if (index !== -1) {
      student.pinned.splice(index, 1);
      await student.save();
    }
    return res.redirect("back");
  } catch (error) {}
};

module.exports.internalmarks = async (req, res) => {
  try {
    checkurlfunct.checkurlstudent(req, res);
    const studentdata = await Student.findOne({
      username: res.locals.user.username,
    });
    const internal = await Attendance.find({
      studentid: studentdata._id,
    })
      .populate({ path: "timetableid", populate: { path: "subjectcode" } })
      .sort({ "timetableid.subjectcode.name": 1 });
    internal.sort((a, b) => {
      const subjectCodeA = a.timetableid.subjectcode.type;
      const subjectCodeB = b.timetableid.subjectcode.type;

      // First, compare based on subjectCode in ascending order
      const subjectCodeComparison = subjectCodeB.localeCompare(subjectCodeA);
      // return subjectCodeA.localeCompare(subjectCodeB);

        if (subjectCodeComparison !== 0) {
          // If subjectCode is not equal, return the comparison result
          console.log("equal")
          return subjectCodeComparison;
        } else {
          // If subjectCode is equal, compare based on name in ascending order
          const nameA = a.timetableid.subjectcode.name;
          const nameB = b.timetableid.subjectcode.name;
          return nameA.localeCompare(nameB);
        }
    });
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
    }).select("timetableid -_id");
    var teacherdata = [];
    for (let i = 0; i < attendance.length; i++) {
      const teacher = await Timetable.findOne({
        _id: attendance[i].timetableid,
      }).populate("teacherid subjectcode");
      let check = await Feedback.findOne({ timetableid: teacher._id, studentid: studentdata._id });
      if (!check) {
        
        teacherdata.push(teacher);
      }

    }
    return res.render("student/feedback", {
      title: "Feedback",
      student: studentdata,
      teacherdata,
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
    let attendancesingle;
    console.log(attendance);
    return res.render("student/attendance_view", {
      title: "Attendance",
      attendance,
      attendancesingle,
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
    const attendancesingle = await Attendance.findByIdAndUpdate(
      req.params.id
    ).populate({
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
    let subject = await attendancesingle.timetableid.subjectcode;
    return res.render("student/attendance_view", {
      title: "Attendance",
      attendance,
      attendancesingle,
      subject: subject,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.enter_feedback = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id).populate('teacherid');
    if (timetable) {
      return res.render("student/feedback_response", {
        title: "Submit Feedback",
        timetable,
      });
    }
    return res.render("components/error404", {
      title: "Error",
    });
  } catch (Error) {
    console.log(Error);
  }
};

module.exports.feedbackdata = async (req, res) => {
  try {
    checkurlfunct.checkurlstudent(req, res);
    const studentdata = await Student.findOne({
      username: res.locals.user.username,
    });
    const timetableid = req.body.xyz;
    let feeddata = [];
    feeddata.push(req.body.q1);
    feeddata.push(req.body.q2);
    feeddata.push(req.body.q3);
    feeddata.push(req.body.q4);
    feeddata.push(req.body.q5);
    feeddata.push(req.body.q6);
    feeddata.push(req.body.q7);
    feeddata.push(req.body.q8);
    feeddata.push(req.body.q9);
    if (timetableid) {
      const subjectdata = await Timetable.findById(timetableid);
      console.log(subjectdata);
      if (subjectdata) {
        let checkatt = await Attendance.findOne({ timetableid: subjectdata._id, studentid: studentdata._id });
        console.log(checkatt);
        if (checkatt) {
          await Feedback.create({
            studentid: studentdata._id,
            timetableid: subjectdata._id,
            feedback: feeddata,
            question10: String(req.body.q10)
          })
        }
      }
    }
    req.flash("success", "Feedback submitted.");
    return res.redirect("../feedback");
  } catch (error) {
    console.log(error);
  }
};

module.exports.fetchnoti = async (req, res) => {
  try {
    function isUpdatedTimeWithin30Seconds(updatedTime) {
      const currentTime = new Date();
      const timeDifference =
        (currentTime.getTime() - updatedTime.getTime()) / 1000; // Convert to seconds

      return timeDifference >= 0 && timeDifference <= 10;
    }
    const notidata = await Notification.find();
    let newnoti, notitime;
    // console.log("G:",notidata);
    const isWithin30Seconds = isUpdatedTimeWithin30Seconds(
      notidata[notidata.length - 1].updatedAt
    );
    if (isWithin30Seconds) {
      newnoti = notidata[notidata.length - 1];
      notitime = prettydate.format(newnoti.updatedAt);
    } else {
      newnoti = 0;
      notitime = 0;
    }
    // console.log(newnoti.updatedAt);

    return res.status(200).json({ newnoti, notitime });

    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

// student notes

module.exports.notes = async (req, res) => {
  try {
    const deptSem = await SemSection.find({});
    const subject = await Subject.find();
    const semsec = await SemSection.find();
    return res.render("student/std-notes", { title: "Notes", subject, semsec});
  } catch (error) {
    console.log(error);
  }
};
module.exports.searchnotes = async (req, res) => {
  try {
    checkurlfunct.checkurlstudent(req, res);
    console.log(req.query)
    const subject = await Subject.findOne({
      name: String(req.query.sub),
      department: String(req.query.dept),
      course: String(req.query.course),
      semester: Number(String(req.query.sem)),
    });
    const allnotes = await Subjectnotes.findOne({ subjectid: subject._id });
    const notes = allnotes.notes.filter((book) => book.type === "Notes");
    const pyqs = allnotes.notes.filter((book) => book.type === "pyqs");
    const samplepapers = allnotes.notes.filter(
      (book) => book.type === "samplepapers"
    );
    const video = allnotes.notes.filter((book) => book.type === "video");
    if (req.xhr) {
      return res.status(200).json({
        allnotes: allnotes, notes: notes, samplepapers: samplepapers, pyqs: pyqs, video: video
      });
    }p
  } catch (err) {
    console.log(err);
  }
};
module.exports.setting = async (req, res) => {
  try {
    return res.render("student/setting", { title: "Setting" });
  } catch (error) {
    console.log(error);
  }
};
module.exports.changepassword = async (req, res) => {
  try {
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
module.exports.profile = async (req, res) => {
  try {
    const student = await Student.findOne({
      username: res.locals.user.username,
    });
    let existingStudentProfile;
    existingStudentProfile = await studentsProfile.findOne({
      regnNo: res.locals.user.username,
    });
    return res.render("student/profile", {
      title: "Profile",
      student,
      studentdata: existingStudentProfile,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.updateProfile = async (req, res) => {
  try {
    let createdProfile;
    studentsProfile.uploadedFiles(req, res, async function (error) {
      if (error) {
        console.log("**** Multer error :", error);
      } else {
        let regnNo = req.body.regnNo;
        let existingStudentProfileUpdate =
          await studentsProfile.findOneAndUpdate({ regnNo: regnNo }, req.body);
        if (existingStudentProfileUpdate) {
        } else {
          await studentsProfile.create(req.body, (err, studentProfile) => {
            if (err) {
              console.log("error in finding user ", err);
              return res.json({ Error: err });
            }
          });
        }
      }
      async function load_file() {
        if (req.file) {
          let existingStudentProfile;
          existingStudentProfile = await studentsProfile.findOne({
            regnNo: req.body.regnNo,
          });
          let student = await Student.findOne({
            username: req.body.regnNo,
          });
          if (
            existingStudentProfile.avatar &&
            existingStudentProfile.avatar != "/images/account.svg"
          ) {
            fs.unlinkSync(
              path.join(__dirname, "..", existingStudentProfile.avatar)
            );
          }
          student.avatar = studentsProfile.filePath + "/" + req.file.filename;
          existingStudentProfile.avatar =
            studentsProfile.filePath + "/" + req.file.filename;
          await existingStudentProfile.save();
          await student.save();
        }
        if (req.files) {
          let files = req.files;
          let existingStudentProfile;
          existingStudentProfile = await studentsProfile.findOne({
            regnNo: req.body.regnNo,
          });
          await processFiles(existingStudentProfile);
          async function processFiles(existingStudentProfile) {
            for (let file of files) {
              // console.log(existingStudentProfile);
              let tempPath = studentsProfile.filePath + "/" + file.filename;
              existingStudentProfile.fileexcel.push(tempPath);
            }
            await existingStudentProfile.save();
          }
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
module.exports.report = async (req, res) => {
  try {
    let student = await Student.findOne({ username: res.locals.user.username });
    let reportdata = '';
    if (student) {
      reportdata = await studentreport.find({studentid: student._id}).populate('studentid').sort({ updatedAt: -1 });
    }
    let timearr = [];
    for (let i = 0; i < reportdata.length; i++){
      let it = prettydate.format(reportdata[i].updatedAt);
      timearr.push(it);
    }
    // console.log(reportdata);
    return res.render("student/report", {
      title: "Report",
      reportdata, timearr
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.sendreport = async (req, res) => {
  try {
    let student = await Student.findOne({ username: res.locals.user.username });
    if (student) {
      await studentreport.create({
        subject: String(req.body.subject),
        description: String(req.body.description),
        studentid: student._id,
        department: student.department
      });
    }
    req.flash("success", "Report send");
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
module.exports.assignment = async (req, res) => {
  try {
    function pushElementsToArray(mainArray, element) {
      if (typeof element === "object" && !Array.isArray(element)) {
        // If the element is an object, push it into the main array.
        mainArray.push(element);
      } else if (Array.isArray(element)) {
        // If the element is an array, concatenate its elements into the main array.
        mainArray.push(...element);
      } else {
        // If the element is neither an object nor an array, just push it into the main array.
        mainArray.push(element);
      }
    }
    checkurlfunct.checkurlstudent(req, res);
    const studentdata = await Student.findOne({
      username: res.locals.user.username,
    });
    const timetabledata = await Attendance.find({
      studentid: studentdata._id,
    })
      .populate({ path: "timetableid", populate: { path: "subjectcode" } })
      .sort({ "timetableid.subjectcode.name": 1 });
    let assignmentdatasub = [];
    let assignmentdatanot = [];
    let assignmentdatagrad = [];
    for (let i = 0; i < timetabledata.length; i++){
      const assignmentone = await Assignment.find({
        timetableid: timetabledata[i].timetableid._id
      }).populate({ path: "timetableid", populate: { path: "subjectcode" } });
      for (let j = 0; j < assignmentone.length; j++) {
        if (assignmentone[j].status == "notgraded") {
          const checkassign = await studentAssignment.findOne({ studentid: studentdata._id, assignmentid: assignmentone[j]._id });
          if (checkassign) {
            pushElementsToArray(assignmentdatasub, assignmentone[j]);
          } else {
            pushElementsToArray(assignmentdatanot, assignmentone[j]);
          }
        }
        if (assignmentone[j].status == "graded") {
          pushElementsToArray(assignmentdatagrad, assignmentone[j]);
        }
        
      }
    }
    return res.render("student/assignment", {
      title: "Assignment",
      assignmentdatasub, assignmentdatagrad, assignmentdatanot
    });
    
  } catch (error) {
    console.log(error);
  }
};
module.exports.assignmentsubmit = async (req, res) => {
  try {
    console.lo
    studentAssignment.uploadedFiles(req, res, async function (error) {
      if (error) {
        console.log("**** Multer error :", error);
      } else {
        
      }
      async function load_file() {
        if (req.file) {
          const studentdata = await Student.findOne({
            username: res.locals.user.username,
          });
          await studentAssignment.create({
            assignmentid: req.body.assignmentid,
            studentid: studentdata._id,
            pdfpath: studentAssignment.filePath + "/" + req.file.filename,
            submittime: Date.now()
          });
        }
      }
      await load_file();
    });
    return res.redirect('back');
  } catch (error) {
    console.log(error);
  }
};
