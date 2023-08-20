const User = require("../models/user");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timetable");
const Subject = require("../models/subject");
const Admin = require("../models/admin");
const checkurlfunct = require("./server-function");
const Subjectnotes = require("../models/notes");
const Calendar = require("../models/calendar");
const Noti = require("../models/notification");
const Department = require("../models/department");
const SemSection = require("../models/semsection");
const studentsProfile = require("../models/studentProfile");
const TG = require("../models/tg");
const Tempupload = require("../models/templateupoad");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const XLSX = require("xlsx");
const teachersProfile = require("../models/teacherprofile");
const admin_mailer = require("../mailer/admin_mailer");
const studentreport = require("../models/student_report");
const deactivateaccount = require("../models/deactivatedaccount");
const prettydate = require("pretty-date");
const DeactivateAccount = require("../models/deactivatedaccount");
const AttendanceGrant = require("../models/attendancegrant");
const FeedbackAdmin = require("../models/feedbackadmin");
const Attendance = require("../models/attendance");


//Dashboard
module.exports.dashboard = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    let admindata = await Admin.findOne({ username: res.locals.user.username });
    let teacherdata = await Teacher.find({ department: admindata.department });
    let calendardata = await Calendar.find({});
    res.render("admin/dashboard", {
      title: "Dashboard",
      teacher: teacherdata,
      admin: admindata,
      calendardata
    });
  } catch (err) {
    console.log(err);
  }
};
//Add Student Page
module.exports.addstudent = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    const dept = await Department.find(
      {},
      { _id: 0, department: 1, course: 1 }
    );
    return res.render("admin/addstudent", {
      title: "Create Student ID",
      dept,
    });
  } catch (error) {
    console.log(error);
  }
};
//Add Teacher Page
module.exports.addteacher = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    const dept = await Department.distinct("department");
    return res.render("admin/addteacher", {
      title: "Create Teacher ID",
      dept,
    });
  } catch (error) {
    console.log(error);
  }
};
//Creating new Student id used in Add student page
module.exports.createstudent = async function (req, res) {
  try {
    var obj = req.body;
    var key = Object.keys(obj);
    var len = key.length;
    for (let i = 0; i < len; i++) {
      let user = await User.findOne({ username: req.body[key[i]] });
      console.log(user);
      if (!user) {
        await User.create({
          username: req.body[key[i]],
          password: req.body[key[i + 4]],
          position: "student",
        });
        await Student.create({
          username: req.body[key[i]],
          name: req.body[key[i + 1]],
          department: req.body[key[i + 2]],
          course: req.body[key[i + 3]],
          deactivatestate: false,
          avatar: "/images/account.svg",
        });
        await studentsProfile.create({
          regnNo: req.body[key[i]],
          avatar: "/images/account.svg",
        });
      }
      i = i + 4;
    }
    return res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
};
module.exports.createstudentWexcel = async function (req, res) {
  try {
    try {
      let path = await new Promise((resolve, reject) => {
        Tempupload.uploadfileexcel(req, res, function (error) {
          if (error) {
            console.log("** Multer error:", error);
            reject(error);
          }
          resolve(Tempupload.uploadpath + "/" + req.file.filename);
        });
      });
    } catch (error) {
      console.log(error);
    }
    let url = Tempupload.uploadpath + "/" + req.file.filename;
    url = url.slice(1);
    console.log(url);
    const workbook = XLSX.readFile(url);
    const worksheet = workbook.Sheets["Studentlist"];
    let i = 2;
    let cellToUpdate = String("A" + i);
    try {
      while (worksheet[cellToUpdate] != undefined) {
        cellToUpdate = String("A" + i);
        cellname = String("B" + i);
        celldept = String("C" + i);
        cellcourse = String("D" + i);
        let std_registration = Number(worksheet[cellToUpdate].v);
        let userdata = await User.findOne({ username: std_registration });
        if (!userdata) {
          await Student.create({
            username: std_registration,
            name: worksheet[cellname].v,
            department: worksheet[celldept].v,
            course: worksheet[cellcourse].v,
            deactivatestate: false,
            avatar: "/images/account.svg",
          });
          await User.create({
            username: std_registration,
            position: "student",
            password: "1",
          });
          await studentsProfile.create({
            regnNo: std_registration,
            avatar: "/images/account.svg",
          });
        }
        i++;
      }
    } catch (error) {
      console.log(error);
    }
    fs.unlinkSync(path.join(__dirname, "..", url));
    return res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
};
//Creating a new Teacher id used in Add Teacher page
module.exports.createteacher = async function (req, res) {
  try {
    var obj = req.body;
    var key = Object.keys(obj);
    var len = key.length;
    for (let i = 0; i < len; i++) {
      let user = await User.findOne({ username: req.body[key[i]] });
      if (!user) {
        await User.create({
          username: req.body[key[i]],
          password: req.body[key[i + 4]],
          position: "teacher",
        });
        await Teacher.create({
          username: req.body[key[i]],
          name: req.body[key[i + 1]],
          department: req.body[key[i + 2]],
          position: req.body[key[i + 3]],
          avatar: "/images/account.svg",
        });
        await teachersProfile.create({
          regnNo: req.body[key[i]],
          avatar: "/images/account.svg",
        });
      }
      i = i + 4;
    }
    return res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
};
module.exports.createteacherWexcel = async function (req, res) {
  try {
    try {
      let path = await new Promise((resolve, reject) => {
        Tempupload.uploadfileexcel(req, res, function (error) {
          if (error) {
            console.log("** Multer error:", error);
            reject(error);
          }
          resolve(Tempupload.uploadpath + "/" + req.file.filename);
        });
      });
    } catch (error) {
      console.log(error);
    }
    let url = Tempupload.uploadpath + "/" + req.file.filename;
    url = url.slice(1);
    console.log(url);
    const workbook = XLSX.readFile(url);
    const worksheet = workbook.Sheets["Teacherlist"];
    let i = 2;
    let cellToUpdate = String("A" + i);
    try {
      while (worksheet[cellToUpdate] != undefined) {
        cellToUpdate = String("A" + i);
        cellname = String("B" + i);
        celldept = String("C" + i);
        cellposition = String("D" + i);
        let std_registration = Number(worksheet[cellToUpdate].v);
        let userdata = await User.findOne({ username: std_registration });
        if (!userdata) {
          await Teacher.create({
            username: std_registration,
            name: worksheet[cellname].v,
            department: worksheet[celldept].v,
            position: worksheet[cellposition].v,
            avatar: "/images/account.svg",
          });
          await User.create({
            username: std_registration,
            position: "teacher",
            password: "1",
          });
          await teachersProfile.create({
            regnNo: std_registration,
            avatar: "/images/account.svg",
          });
        }
        i++;
      }
    } catch (error) {
      console.log(error);
    }
    fs.unlinkSync(path.join(__dirname, "..", url));
    return res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
};
//Allot Subject Page
module.exports.allotsubject = (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    return res.render("admin/allotsubject", { title: "Allot Subject" });
  } catch (error) {
    console.log(error);
  }
};
//Searching teacher id from the teacher database for alloting subject used in allot subject page
module.exports.searchteacherid = async function (req, res) {
  try {
    let result = await Teacher.find({
      name: { $regex: new RegExp("^" + req.params.id + ".*", "i") },
    }).limit(5);
    if (req.xhr) {
      return res.status(200).json({
        data: {
          result,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.searchbaralotsubject = async function (req, res) {
  try {
    console.log(typeof req.params.id);
    let teacherdata = await Teacher.findOne({
      username: req.params.id,
    });
    if (!teacherdata) {
      req.flash("error", "Teacher does not exist.");
      res.redirect("back");
    }
    const subject = await Subject.find();
    const semsec = await SemSection.find();
    let timetables = await Timetable.find({
      teacherid: teacherdata._id,
    }).populate("subjectcode");
    return res.render("admin/allotsubjectform", {
      title: "Allot Subject data",
      teacher: teacherdata,
      timetable: timetables,
      subject,
      semsec,
    });
  } catch (err) {
    console.log(err);
  }
};
//Allot Subject to teachers used in allot subject page
module.exports.addsubject = async function (req, res) {
  try {
    let year;
    switch (parseInt(req.body.semester)) {
      case 1:
        year = 1;
        break;
      case 2:
        year = 1;
        break;
      case 3:
        year = 2;
        break;
      case 4:
        year = 2;
        break;
      case 5:
        year = 3;
        break;
      case 6:
        year = 3;
        break;
      case 7:
        year = 4;
        break;
      case 8:
        year = 4;
        break;
      default:
        console.log("Incorrect semester value.");
      //error to changed later @RAJ
    }
    const subjectCode = req.body.subname;
    var subjectName;
    let dept = req.body.department
    let subject = await Subject.findOne({ name: subjectCode });
    subjectName = subject._id;
    let teacherdata = await Teacher.findOne({
      username: req.body.registration,
    });
    const sourceFilePath = "./data/template_result_analysis.xlsx";
    const destinationFilePath = "./upload/resultanalysis/" + req.body.department + "_" + req.body.course + "_" + req.body.semester + "_" + subject.name+".xlsx";
    fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
      if (err) {
        console.error("Error copying file:", err);
      } else {
        console.log("File copied successfully");
      }
    });
    if (subject.type == "Theory") {
      await Timetable.create({
        department: req.body.department,
        course: req.body.course,
        year: year,
        semester: req.body.semester,
        section: req.body.section,
        teacherid: teacherdata._id,
        subjectcode: subjectName,
        classes: [],
        internalmarks: [
          { Quiz1: "10" },
          { Quiz2: "10" },
          { Session1: "50" },
          { Session2: "50" },
          { Assignment: "5" },
        ],
        resultanalysis: destinationFilePath,
      });
    }
    if (subject.type == "Lab") {
      await Timetable.create({
        department: req.body.department,
        course: req.body.course,
        year: year,
        semester: req.body.semester,
        section: req.body.section,
        teacherid: teacherdata._id,
        subjectcode: subjectName,
        classes: [],
        internalmarks: [{ Final: "120" }],
        resultanalysis: destinationFilePath,
      });
    }

    req.flash("success", "Subject allot successfully");
    return res.redirect("back");
    // return res.render("admin/allotsubjectform", {
    //   title: "Allot Subject data",
    //   teacher: teacherdata,
    //   timetable: timetables,
    // });
  } catch (err) {
    console.log(err);
  }
};
//Deleting assigned subject from teacher used in allot subject page
module.exports.deletesubject = async function (req, res) {
  try {
    let id = req.query.id;
    await Timetable.findByIdAndDelete(id);
    let teacherdata = await Teacher.findOne({ _id: req.query.teacherid });
    let timetables = await Timetable.find({
      username: teacherdata._id,
    }).populate("subjectcode");
    req.flash("success", "Subject deleted successfully");
    return res.redirect("back");
    // return res.render("admin/allotsubjectform", {
    //   title: "Allot Subject data",
    //   teacher: teacherdata,
    //   timetable: timetables,
    // });
  } catch (err) {
    console.log(err);
  }
};

module.exports.calendar = async function (req, res) {
  try {
    let calendardata = await Calendar.find({});
    // console.log(typeof(calendardata));
    // console.log(calendardata);
    for (let i = 0; i < calendardata.length; i++) {
      let datestring = String(calendardata[i].date);
      datestring = datestring.slice(0, 11);
      calendardata[i].date = datestring;
      // console.log(datestring);
    }
    return res.render("admin/calendar", {
      title: "Add Holidays",
      calendardata,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.addholiday = async function (req, res) {
  try {
    await Calendar.create(req.body);

    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports.notification = async function (req, res) {
  try {
    const notidata = await Noti.find({});
    console.log(notidata);

    return res.render("admin/create_notification", {
      title: "Create Notification",
      notidata,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.createnoti = async function (req, res) {
  try {
    // console.log(req.file);
    let noti = Noti.uploadfile(req, res, function (error) {
      if (error) {
        console.log("** Multer error:", error);
      }
      Noti.create({
        title: req.body.title,
        notiflie: Noti.uploadpath + "/" + req.file.filename,
      });
    });
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports.allottg = async (req, res) => {
  try {
    return res.render("admin/allottg", { title: "Allot TG" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.allottg_std = async (req, res) => {
  try {
    return res.render("admin/allottg-std", { title: "Allot TG to Students" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.tgsearch = async (req, res) => {
  try {
    console.log(req.params.id);
    let teacherdata = await Teacher.findOne({
      username: req.params.id,
    });
    if (!teacherdata) {
      req.flash("error", "Teacher does not exist.");
      res.redirect("back");
    }
    let tgdata = await TG.find({ teacherid: teacherdata._id }).populate(
      "studentid"
    );
    console.log("TG: ", tgdata);
    return res.render("admin/allottg-std", {
      title: "Allot TG to Students",
      teacher: teacherdata,
      tgdata,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.addward = async (req, res) => {
  try {
    try {
      let path = await new Promise((resolve, reject) => {
        TG.uploadfileexcel(req, res, function (error) {
          if (error) {
            console.log("** Multer error:", error);
            reject(error);
          }
          resolve(TG.uploadpath + "\\" + req.file.filename);
        });
      });
    } catch (error) {
      console.log(error);
    }
    let url = TG.uploadpath + "\\" + req.file.filename;
    url = url.slice(1);
    const workbook = XLSX.readFile(url);
    const worksheet = workbook.Sheets["Ward_List"];
    for (let i = 2; i < 50; i++) {
      try {
        let cellToUpdate = String("A" + i);
        // console.log("Cell: ",cellToUpdate);
        if (!worksheet[cellToUpdate]) {
          break;
        }
        console.log(worksheet[cellToUpdate].v);
        let std_registration = Number(worksheet[cellToUpdate].v);
        console.log(std_registration);
        let studentdata = await Student.findOne({ username: std_registration });
        // console.log(studentdata);
        let tgcheck = await TG.findOne({ studentid: studentdata._id });
        console.log("Check: ", tgcheck);
        if (!tgcheck) {
          console.log("Created");
          await TG.create({
            teacherid: req.body.teacherid,
            studentid: studentdata._id,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports.dept = async (req, res) => {
  try {
    let dept = await Department.find({});
    return res.render("admin/addDepartment", { title: "Add Department", dept });
  } catch (error) {
    console.log(error);
  }
};

module.exports.program = async (req, res) => {
  try {
    let dept = await Department.find({});
    let programlist = 0;
    return res.render("admin/addProgram", {
      title: "Add Program",
      dept,
      programlist,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.searchprogram = async (req, res) => {
  try {
    let dept = await Department.find({});
    let programlist = await Department.findOne({ department: req.params.id });
    return res.render("admin/addProgram", {
      title: "Add Program",
      dept,
      programlist,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.adddept = async (req, res) => {
  try {
    let checkdept = await Department.findOne({
      department: req.body.department,
    });
    console.log(checkdept);
    if (!checkdept) {
      await Department.create({
        department: req.body.department,
      });
    }
    let dept = await Department.find();

    if (req.xhr) {
      return res.status(200).json({
        data: {
          dept: dept[dept.length - 1],
        },
      });
    }
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
module.exports.addprogram = async (req, res) => {
  try {
    console.log(req.body);
    let checkdept = await Department.findOne({
      department: req.body.department,
    });
    console.log(checkdept);
    if (checkdept) {
      let program = req.body.program;
      checkdept.course.push(program);
      console.log("Done");
      checkdept.save();
    }
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
module.exports.deleteprogram = async (req, res) => {
  try {
    let checkdept = await Department.findById(req.params.id.slice(1));
    console.log(req.params.id[0]);
    checkdept.course.splice(req.params.id[0], 1);
    console.log("hi", checkdept);
    await checkdept.save();
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
module.exports.deletedepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports.spotsearch = async (req, res) => {
  try {
    // console.log(typeof Number(req.params.id));
    // console.log(isNaN(req.params.id));
    // let result, result1;
    // if (isNaN(req.params.id)) {
      result = await Teacher.find({
        name: { $regex: new RegExp("^" + req.params.id + ".*", "i") },
      }).limit(5);
      result1 = await Student.find({
        name: { $regex: new RegExp("^" + req.params.id + ".*", "i") },
      }).limit(5);
    // }
    // if (!isNaN(Number(req.params.id))) {
    //   console.log("hiii");
    //   let str = Number(req.params.id);
    //   let str1 = 2021;
    //   console.log(typeof str1);
    //   result = await Teacher.find({
    //     username: { $regex: str1 },
    //   }).limit(5);
    //   // result1 = await Student.find({ username: { $regex: str1 }}).limit(5);
    //   console.log(result);
    // }
    if (req.xhr) {
      return res.status(200).json({
        data: {
          result: result,
          result1: result1,
        },
      });
    }
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports.setting = async (req, res) => {
  try {
    return res.render("admin/setting", { title: "Setting" });
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

module.exports.semester = async (req, res) => {
  try {
    const dept = await Department.find({});
    const course = [];
    return res.render("admin/admin-create-sem", {
      title: "Create Semester",
      dept,
      course,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.semestercourse = async (req, res) => {
  try {
    const dept = await Department.find({});
    const course = await Department.findById(req.params.id);

    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
module.exports.createsem = async (req, res) => {
  try {
    console.log(req.body);
    let department = req.body.department;
    let course = req.body.courses;
    // console.log(req.body.secondary);
    let sem = req.body.semester;
    let sec = req.body.section;
    let semco = req.body.semco;
    let secco = req.body.secco;
    let j = 0;
    // console.log(sem, sec);
    for (let i = 0; i < sem.length; i++) {
      let check = 0;
      if (sec[j] == "A") {
        check = 1;
        await SemSection.create({
          department: department,
          course: course,
          semester: sem[i],
          section: sec[j],
          semesterCoordinator: semco[i],
          sectionCoordinator: secco[j],
        });
        console.log(sem[i], sec[j]);
      }
      let k = j + 1;
      for (; k < sec.length; k++) {
        if (sec[k] == "A" && check == 1) {
          break;
        }
        console.log(sem[i], secco[k]);
        await SemSection.create({
          department: department,
          course: course,
          semester: sem[i],
          section: sec[k],
          semesterCoordinator: semco[i],
          sectionCoordinator: secco[k],
        });
      }
      j = k;
    }
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports.signUp = (req, res) => {
  checkurlfunct.checkurladmin(req, res);
  return res.render("login-signup/signup", {
    title: "Sign Up",
  });
};

module.exports.create = async (req, res) => {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.redirect("back");
    }
    let user = await User.findOne({ username: req.body.username });
    await User.create(req.body);
    // await Admin.create(req.body);
    return res.redirect("/admin/dashboard");
  } catch (err) {
    console.log(err);
  }
};
module.exports.adminstudentprofile = async (req, res) => {
  let student = await Student.findById(req.params.id);
  let studentdata = await studentsProfile.findOne({ regnNo: student.username });
  return res.render("student/profile", {
    title: "Profile",
    student,
    studentdata,
  });
};
module.exports.adminteacherprofile = async (req, res) => {
  let student = await Student.findById(req.params.id);
  return res.render("teacher/profile-teach", {
    title: "Profile",
    student,
  });
};

module.exports.deactivate = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    const deptSem = await SemSection.find();
    res.render("admin/deactivate-accnt", {
      title: "Deactivate Account",
      deptSem,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.deactivatesearch = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    dept = String(req.query.dept);
    course = String(req.query.course);
    sem = Number(req.query.sem);
    const studdata = await Student.find({
      department: dept,
      course: course,
      semester: sem,
      // deactivatestate: false //Remember to remove once data is reset
    });
    if (studdata) {
      if (req.xhr) {
        return res.status(200).json({
          studentlist: studdata,
        });
      }
    } else {
      if (req.xhr) {
        return res.status(200).json({
          studentlist: -1,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.deactivateaccount = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    console.log(req.body);
    if (req.body.check) {
      let check = req.body.check;
      for (let i = 0; i < check.length; i++) {
        console.log("Check: ", check[i]);
        const usercheck = await User.findOne({ username: Number(check[i]) });
        console.log("User: ", usercheck);
        if (usercheck) {
          let studentdata = await Student.findOne({
            username: usercheck.username,
          });
          studentdata.deactivatestate = true;
          console.log(studentdata);
          await studentdata.save();
          await DeactivateAccount.create({
            username: usercheck.username,
            password: usercheck.password,
            position: usercheck.position,
            deactDate: Date.now(),
          });
          await User.findByIdAndDelete(usercheck._id);
        }
      }
    }
    req.flash("success", "Account Deactivated");
    return res.redirect("back");
  } catch (err) {
    console.log(err);
  }
};
module.exports.activate = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    const deptSem = await SemSection.find();
    res.render("admin/activate-accnt", {
      title: "Activate Account",
      deptSem,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.activatesearch = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);

    const studdata = await DeactivateAccount.find({
      department: dept,
      course: course,
      semester: sem,
    });
    if (studdata) {
      if (req.xhr) {
        return res.status(200).json({
          studentlist: studdata,
        });
      }
    } else {
      if (req.xhr) {
        return res.status(200).json({
          studentlist: -1,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.activateaccount = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    if (req.body.check) {
      let check = req.body.check;
      for (let i = 0; i < check.length; i++) {
        console.log("Check: ", check[i]);
        const usercheck = await User.findOne({ username: Number(check[i]) });
        console.log("User: ", usercheck);
        if (usercheck) {
          let studentdata = await Student.findOne({
            username: usercheck.username,
          });
          studentdata.deactivatestate = true;
          console.log(studentdata);
          await studentdata.save();
          await DeactivateAccount.create({
            username: usercheck.username,
            password: usercheck.password,
            position: usercheck.position,
            deactDate: Date.now(),
          });
          await User.findByIdAndDelete(usercheck._id);
        }
      }
    }
    req.flash("success", "Account Deactivated");
    return res.redirect("back");
  } catch (err) {
    console.log(err);
  }
};
module.exports.section = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    const semsec = await SemSection.find();
    res.render("admin/addsection", { title: "Section", semsec });
  } catch (err) {
    console.log(err);
  }
};
module.exports.mail = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    const semsec = await SemSection.find();
    // admin_mailer.newmail();
    res.render("admin/mail", { title: "Mail", semsec });
  } catch (err) {
    console.log(err);
  }
};
module.exports.searchsectionstudent = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    let studentlist = await Student.find(req.query);
    if (req.xhr) {
      return res.status(200).json({
        studentlist: studentlist,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.addstudentsection = async function (req, res) {
  try {
    try {
      let path = await new Promise((resolve, reject) => {
        Tempupload.uploadfileexcel(req, res, function (error) {
          if (error) {
            console.log("** Multer error:", error);
            reject(error);
          }
          resolve(Tempupload.uploadpath + "/" + req.file.filename);
        });
      });
    } catch (error) {
      console.log(error);
    }
    let url = Tempupload.uploadpath + "/" + req.file.filename;
    url = url.slice(1);
    const workbook = XLSX.readFile(url);
    const worksheet = workbook.Sheets["Student"];
    let i = 2;
    let cellToUpdate = String("A" + i);
    console.log(req.body);
    try {
      while (worksheet[cellToUpdate] != undefined) {
        cellToUpdate = String("A" + i);
        let std_registration = Number(worksheet[cellToUpdate].v);
        let student = await Student.findOneAndUpdate(
          { username: std_registration },
          {
            department: String(req.body.department),
            course: String(req.body.course),
            semester: req.body.semester,
            section: String(req.body.section),
          }
        );
        await student.save();
        i++;
      }
    } catch (error) {
      console.log(error);
    }
    fs.unlinkSync(path.join(__dirname, "..", url));
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports.reports = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);

    let reportdata = await studentreport
      .find()
      .populate("studentid")
      .sort({ updatedAt: -1 });
    let timearr = [];
    for (let i = 0; i < reportdata.length; i++) {
      timearr[i] = prettydate.format(reportdata[i].updatedAt);
    }
    res.render("admin/report", { title: "Report", reportdata, timearr });
  } catch (err) {
    console.log(err);
  }
};
module.exports.feedback = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    const deptSem = await SemSection.find();
    let admindata = await Admin.findOne({ username: res.locals.user.username });
    const feedbackadmindata = await FeedbackAdmin.find({department: admindata.department});
    return res.render("admin/create-feedback", {
      title: "Feedback",
      deptSem,
      feedbackadmindata,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.createfeedback = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    let check = await FeedbackAdmin.findOne({
      department: String(req.body.department),
      course: String(req.body.course),
      semester: Number(req.body.semester),
    });
    if (!check) {
      await FeedbackAdmin.create({
        department: String(req.body.department),
        course: String(req.body.course),
        semester: Number(req.body.semester),
        deadline: req.body.deadline
      })
    }
    return res.redirect('back');
  } catch (err) {
    console.log(err);
  }
};
module.exports.resultfeedback = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    const feedbackdata = await FeedbackAdmin.findById(req.params.id);
    console.log(feedbackdata)
    const subject = await Timetable.find({
      department: feedbackdata.department, course: feedbackdata.course, semester:feedbackdata.semester
    }).populate('subjectcode');
    let department = feedbackdata.department;
    let course = feedbackdata.course;
    let semester = feedbackdata.semester;
    return res.render("admin/feedback", {
      title: "Feedback", subject, feedbackdata, department, course, semester
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.singlefeedback = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    // let timetable = await Timetable.find({})
    if (req.xhr) {
      return res.status(200).json({
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.attendancegrant = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    let assignmentgrant = await AttendanceGrant.find({}).sort({updatedAt: -1})
    res.render("admin/attendancegrant", {
      title: "Assignment Grant", assignmentgrant
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.tghome = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    return res.render("admin/tghome", {
      title: "TG Home"
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.tggetdata = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    console.log(req.query);
    let feedlist = await FeedbackAdmin.find({department: req.query.department})
    let data = "asdad";
    if (req.xhr) {
      return res.status(200).json({
        data: data
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.conattendance = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    const semsec = await SemSection.find();
    res.render("admin/Consolidate_Attendance", {
      title: "Consolidate Attendance", semsec
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.conattendancereport = async (req, res) => {
  try {
    console.log(req.body)
    let subjectlist = await Timetable.find({ department: req.body.department, course: req.body.course, semester: req.body.semester, section: req.body.section }).populate('subjectcode');
    let attarr = [];
    let attarr2 = [];
    let studentlist = await Student.find({
      department: req.body.department,
      course: req.body.course,
      semester: req.body.semester,
      section: req.body.section,
    });
    for (let i = 0; i < studentlist.length; i++){
      let studentsingle = [];
      for (let j = 0; j < subjectlist.length; j++){
        let attsingle = await Attendance.findOne({
          studentid: studentlist[i]._id,
          timetableid: subjectlist[j]._id,
        }).populate("studentid");
        studentsingle.push(attsingle);
        console.log(i,j)
      }
      attarr.push(studentsingle);
      // if (attsingle.studentid._id == studentlist._id) {
      // }
      // else {
      //   attarr2.push(attsingle);
      // }
      // console.log(attarr2);
      
    }
    console.log(attarr);
    return res.render("admin/Consolidate_Attendance_report", {
      title: "Consolidate Attendance Report", subjectlist, attarr, attarr2, studentlist
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.attendancegrantadd = async (req, res) => {
  try {
    let admin = await Admin.findOne({ username: res.locals.user.username });
    if (admin) {
      AttendanceGrant.uploadedFiles(req, res, async function (error) {
        if (error) {
          console.log("**** Multer error :", error);
        } else {
        }
        async function load_file() {
          if (req.file) {
            await AttendanceGrant.create({
              enteredby: admin.name,
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


module.exports.tgward = (req, res) => {
  checkurlfunct.checkurladmin(req, res);
  return res.render("admin/tgward", {
    title: "TG Wards",
  });
};
