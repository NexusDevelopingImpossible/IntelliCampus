const User = require("../models/user");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timetable");
const Subject = require("../models/subject");
const Admin = require("../models/admin");
const checkurlfunct = require("./server-function");
const Calendar = require("../models/calendar");
const Noti = require("../models/notification");
const Department = require("../models/department");
const SemSection = require("../models/semsection");
const TG = require("../models/tg");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const XLSX = require("xlsx");
//Dashboard
module.exports.dashboard = async (req, res) => {
  try {
    checkurlfunct.checkurladmin(req, res);
    let admindata = await Admin.findOne({ username: res.locals.user.username });
    let teacherdata = await Teacher.find({ department: admindata.department });
    res.render("admin/dashboard", { title: "Dashboard", teacher: teacherdata });
  } catch (err) {
    console.log(err);
  }
};
//Add Student Page
module.exports.addstudent = (req, res) => {
  checkurlfunct.checkurladmin(req, res);
  return res.render("admin/addstudent", {
    title: "Create Student ID",
  });
};
//Add Teacher Page
module.exports.addteacher = (req, res) => {
  checkurlfunct.checkurladmin(req, res);
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
  checkurlfunct.checkurladmin(req, res);
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
    let department = await Department.find({});
    return res.render("admin/allotsubjectform", {
      title: "Allot Subject data",
      teacher: teacherdata,
      timetable: timetables,
      dept: department
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
    let tgdata = await TG.find({ teacherid: teacherdata._id }).populate('studentid');
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
      console.log(error)
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
    return res.render("admin/addDepartment", { title: "Add Department", dept});
  } catch (error) {
    console.log(error);
  }
};


module.exports.program = async (req, res) => {
  try {
    let dept = await Department.find({});
    let programlist = 0;
    return res.render("admin/addProgram", { title: "Add Program", dept, programlist});
  } catch (error) {
    console.log(error);
  }
};
module.exports.searchprogram = async (req, res) => {
  try {
    let dept = await Department.find({});
    let programlist = await Department.findOne({department:req.params.id})
    return res.render("admin/addProgram", { title: "Add Program", dept, programlist});
  } catch (error) {
    console.log(error);
  }
};
module.exports.adddept = async (req, res) => {
  try {
    let checkdept = await Department.findOne({department: req.body.department});
    console.log(checkdept);
    if(!checkdept){
      await Department.create({
        department: req.body.department
      })
    }
    if (req.xhr) {
      return res.status(200).json({
        data: {
          dept: req.body.department
        },
      });}
    return res.redirect('back');
  } catch (error) {
    console.log(error);
  }
};
module.exports.addprogram = async (req, res) => {
  try {
    console.log(req.body);
    let checkdept = await Department.findOne({department: req.body.department});
    console.log(checkdept);
    if(checkdept){
      let program = req.body.program;
      checkdept.course.push(program);
      console.log("Done")
      checkdept.save();
    }
    return res.redirect('back');
  } catch (error) {
    console.log(error);
  }
};
module.exports.deleteprogram = async (req, res) => {
  try {
    let checkdept = await Department.findById(req.params.id.slice(1));
    console.log(req.params.id[0]);
    checkdept.course.splice((req.params.id[0]), 1);
    console.log("hi",checkdept);
    await checkdept.save();
    return res.redirect('back');
  } catch (error) {
    console.log(error);
  }
};
module.exports.deletedepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    return res.redirect('back');
  } catch (error) {
    console.log(error);
  }
};

module.exports.spotsearch = async (req, res) => {
  try {
    // console.log(parseFloat(req.params.id))
    // console.log(isNaN(req.params.id))
    // if(isNaN(req.params.id)){
      let result = await Teacher.find({name: {$regex: new RegExp('^'+ req.params.id +'.*', 'i')}}).limit(5);
      let result1 = await Student.find({name: {$regex: new RegExp('^'+ req.params.id +'.*', 'i')}}).limit(5);
    // }
    // if(!isNaN(parseFloat(req.params.id))){
    //   let str = parseFloat(req.params.id)
    //   let result = await Teacher.find({username: {$regex: new RegExp('^'+ str +'.*', 'i')}}).limit(5);
    //   let result1 = await Student.find({username: {$regex: new RegExp('^'+ str +'.*', 'i')}}).limit(5);
    // }
    
  console.log(result);
  console.log(result1);
  if (req.xhr) {
    return res.status(200).json({
      data: {
        result: result,
        result1: result1
      },
    });
  }
    return res.redirect('back');
  } catch (error) {
    console.log(error);
  }
};

module.exports.setting = async (req, res) => {
  try {
    return res.render("admin/setting", { title: "Setting"});
  } catch (error) {
    console.log(error);
  }
};
module.exports.changepassword = async (req, res) => {
  try {
    if(req.body.newpassword === req.body.new1password){
      let user = await User.findById(res.locals.user._id);
      if(user.password === req.body.oldpassword){
        user.password = req.body.new1password;
        await user.save();
        req.flash("success", "Password Updated");
      } 
      else{
        req.flash("error", "Old password did not match");
      }
    }
    else{
      req.flash("error", "New and Confirm password did not match");
    }
    return res.redirect('back');
  } catch (error) {
    console.log(error);
  }
};



module.exports.semester = async (req, res) => {
  try {
    const dept = await Department.find({}); 
    const course = [];
    return res.render("admin/admin-create-sem", { title: "Create Semester", dept, course});
  } catch (error) {
    console.log(error);
  }
};
module.exports.semestercourse = async (req, res) => {
  try {
    const dept = await Department.find({}); 
    const course = await Department.findById(req.params.id);
    
    return res.redirect('back');
  } catch (error) {
    console.log(error);
  }
};
module.exports.createsem = async (req, res) => {
  try {
    console.log(req.body)
    let department = req.body.primary;
    let course = req.body.secondary;
    // console.log(req.body.secondary);
    let sem = req.body.semester;
    let sec = req.body.section;
    let semco = req.body.semco;
    let secco = req.body.secco;
    let j = 0;
    // console.log(sem, sec);
    for(let i = 0; i<sem.length; i++){
      let check = 0;
      if(sec[j] == 'A'){
        check = 1;
        await SemSection.create({
          department: department,
          course: course,
          semester: sem[i],
          section: sec[j],
          semesterCoordinator: semco[i],
          sectionCoordinator: secco[j]
        })
        console.log(sem[i], sec[j]);
      }
      let k = j + 1;
      for(;k<sec.length; k++){
        if(sec[k] == 'A' && check == 1){
          break;
        }
        console.log(sem[i], sec[k]);
        await SemSection.create({
          department: department,
          course: course,
          semester: sem[i],
          section: sec[k],
          semesterCoordinator: semco[i],
          sectionCoordinator: secco[k]
        })
      }
      j = k;
    }
    return res.redirect('back');
  } catch (error) {
    console.log(error);
  }
};