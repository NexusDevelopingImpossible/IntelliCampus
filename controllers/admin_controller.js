const User = require("../models/user");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timetable");
const Subject = require("../models/subject");
const Admin = require("../models/admin");
const checkurlfunct = require("./server-function");
const Calendar = require("../models/calendar");
const Noti = require("../models/notification");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

//Dashboard
module.exports.dashboard = async (req, res) => {
  try {
    checkurlfunct.checkurladmmin(req, res);
    let admindata = await Admin.findOne({ username: res.locals.user.username });
    let teacherdata = await Teacher.find({ department: admindata.department });
    res.render("admin/dashboard", { title: "Dashboard", teacher: teacherdata });
  } catch (err) {
    console.log(err);
  }
};
//Add Student Page
module.exports.addstudent = (req, res) => {
  checkurlfunct.checkurladmmin(req, res);
  return res.render("admin/addstudent", {
    title: "Create Student ID",
  });
};
//Add Teacher Page
module.exports.addteacher = (req, res) => {
  checkurlfunct.checkurladmmin(req, res);
  return res.render("admin/addteacher", {
    title: "Create Teacher ID",
  });
};
//Creating new Student id used in Add student page
module.exports.createstudent = function (req, res) {
  var obj = req.body;
  var key = Object.keys(obj);
  var len = key.length;
  for (let i = 0; i < len; i++) {
    User.findOne({ username: req.body[key[i]] }, (err, user) => {
      if (user) {
        console.log("User found in the database.");
      } else {
        User.create(
          {
            username: req.body[key[i]],
            password: req.body[key[i + 5]],
            position: "student",
          },
          function (err, newUser) {
            if (err) {
              console.log("Error in creating a user id!");
              return;
            }
            console.log("******", newUser);
          }
        );
        Student.create(
          {
            username: req.body[key[i]],
            name: req.body[key[i + 1]],
            department: req.body[key[i + 2]],
            section: req.body[key[i + 3]],
            semester: req.body[key[i + 4]],
          },
          function (err, newStudent) {
            if (err) {
              console.log("Error in creating a new student id!");
              return;
            }
            console.log("******", newStudent);
          }
        );
      }
      i = i + 5;
    });
  }
  return res.redirect("/admin/dashboard");
};
//Creating a new Teacher id used in Add Teacher page
module.exports.createteacher = function (req, res) {
  var obj = req.body;
  var key = Object.keys(obj);
  var len = key.length;
  for (let i = 0; i < len; i++) {
    User.findOne({ username: req.body[key[i]] }, (err, user) => {
      if (user) {
        console.log("User found in the database.");
      } else {
        User.create(
          {
            username: req.body[key[i]],
            password: req.body[key[i + 4]],
            position: "teacher",
          },
          function (err, newUser) {
            if (err) {
              console.log("Error in creating a user id!");
              return;
            }
            console.log("******", newUser);
          }
        );
        Teacher.create(
          {
            username: req.body[key[i]],
            name: req.body[key[i + 1]],
            department: req.body[key[i + 2]],
            position: req.body[key[i + 3]],
          },
          function (err, newTeacher) {
            if (err) {
              console.log("Error in creating a teacher id!");
              return;
            }
            console.log("******", newTeacher);
          }
        );
      }
      i = i + 4;
    });
  }
  return res.redirect("/admin/dashboard");
};
//Allot Subject Page
module.exports.allotsubject = (req, res) => {
  checkurlfunct.checkurladmmin(req, res);
  return res.render("admin/allotsubject", { title: "Allot Subject" });
};
//Searching teacher id from the teacher database for alloting subject used in allot subject page
module.exports.searchteacherid = async function (req, res) {
  try {
    console.log(req.params.id)
    let teacherdata = await Teacher.findOne({
      username: req.params.id,
    });
    if (!teacherdata) {
      req.flash("error", "Teacher does not exist.");
      res.redirect("back");
    }
    let timetables = await Timetable.find({
      teacherid: teacherdata._id,
    }).populate("subjectcode");
    return res.render("admin/allotsubjectform", {
      title: "Allot Subject data",
      teacher: teacherdata,
      timetable: timetables,
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
    const subjectCode = req.body.code;
    var subjectName;
    let subject = await Subject.findOne({ code: subjectCode });
    subjectName = subject._id;
    let teacherdata = await Teacher.findOne({
      username: req.body.registration,
    });
    await Timetable.create({
      branch: req.body.branch,
      department: req.body.department,
      year: year,
      semester: req.body.semester,
      section: req.body.section,
      teacherid: teacherdata._id,
      subjectcode: subjectName,
      classes: [],
    });
    // return res.redirect('back'); DONT UNCOMMENT THIS

    let timetables = await Timetable.find({
      teacherid: teacherdata._id,
    }).populate("subjectcode");
    req.flash("success", "Subject allot successfully");
    return res.redirect('back')
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
    return res.redirect('back');
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
    console.log(notidata)

    return res.render("admin/create_notification", {
      title: "Create Notification", notidata
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
        notiflie: Noti.uploadpath + '/' + req.file.filename
      })
      // if(req.xhr){
      //   return res.status(200).json({
      //     data: {
      //       noti: notidata
      //     },
      //     message: 'Noti'
      //   })
      // }
    });
    

    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
