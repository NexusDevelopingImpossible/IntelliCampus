const checkurlfunct = require("./server-function");
const Student = require("../models/student");
const studentsProfile = require("../models/studentProfile");
const SemSection = require("../models/semsection");
const Tempupload = require("../models/templateupoad");
const Subject = require("../models/subject");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const XLSX = require("xlsx");

module.exports.dashboard = async (req, res) => {
  try {
    checkurlfunct.checkurlexamcell(req, res);
    res.render("examcell/dashboard", { title: "Dashboard"});
  } catch (err) {
    console.log(err);
  }
};
module.exports.cform = async (req, res) => {
  try {
    checkurlfunct.checkurlexamcell(req, res);
    res.render("examcell/cform", { title: "C Form"});
  } catch (err) {
    console.log(err);
  }
};
module.exports.cgpa = async (req, res) => {
  try {
    checkurlfunct.checkurlexamcell(req, res);
    const deptSem = await SemSection.find();
    res.render("examcell/cgpabacklog", { title: "CGPA & Backlog", deptSem});
  } catch (err) {
    console.log(err);
  }
};
module.exports.createsubject = async (req, res) => {
  try {
    checkurlfunct.checkurlexamcell(req, res);
    const deptSem = await SemSection.find();
    res.render("examcell/createsubject", { title: "Create Subject", deptSem});
  } catch (err) {
    console.log(err);
  }
};
module.exports.addsubject = async (req, res) => {
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
    const worksheet = workbook.Sheets["Subject"];
    let i = 2;
    let cellsubcode = String("A" + i);
    try {
      while(worksheet[cellsubcode]!=undefined){
        cellsubcode = String("A" + i);
        cellsubname = String("B" + i);
        cellsubtype = String("C" + i);
        cellsubtheory = String("D" + i);
        cellcredit = String("E" + i);
        let subcode = String(worksheet[cellsubcode].v);
        let subdata = await Subject.findOne({ code: subcode });
        if(!subdata){
          await Subject.create({
            department: req.body.department,
            course: req.body.course,
            semester: req.body.semester,
            code: subcode,
            name: (worksheet[cellsubname].v),
            type: (worksheet[cellsubtype].v),
            theorytype: (worksheet[cellsubtheory].v),
            credit: (worksheet[cellcredit].v),
          });
        }
        i++;
      }
    } catch (error) {
      console.log(error);
    }
    fs.unlinkSync(
      path.join(__dirname, "..", url)
    );
    return res.redirect('back');
  } catch (err) {
    console.log(err);
  }
};
module.exports.addcgpa = async (req, res) => {
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
    let cellreg = String("A" + i);
    try {
      while(worksheet[cellreg]!=undefined){
        cellreg = String("A" + i);
        cellcgpa = String("C" + i);
        cellnobacklog = String("D" + i);
        cellsub = String("E" + i);
        let arraysub = (String(worksheet[cellsub].v)).split(',');
        let updatearraysub = [];
        for(let j = 0; j<arraysub.length; j++){
          console.log(arraysub[j]);
          let subdata = await Subject.findOne({code: String(arraysub[j])});
          console.log(subdata);
          let substring = subdata.code + ' ' + subdata.name;
          updatearraysub.push(substring);
        }
        let studreg = String(worksheet[cellreg].v);
        let studdata = await studentsProfile.findOneAndUpdate({regnNo:studreg},{cgpa: Number(worksheet[cellcgpa].v),backlog: Number(worksheet[cellnobacklog].v), backloglist: updatearraysub},{ new: true })
        console.log(studdata);
        // studdata.save();
        i++;
      }
    } catch (error) {
      console.log(error);
    }
    fs.unlinkSync(
      path.join(__dirname, "..", url)
    );
    return res.redirect('back');
  } catch (err) {
    console.log(err);
  }
};

module.exports.deletesub = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    return res.redirect('back');
  } catch (err) {
    console.log(err);
  }
};
module.exports.lockinternal = async (req, res) => {
  try {
    checkurlfunct.checkurlexamcell(req, res);
    res.render("examcell/lockinternal", { title: "Lock internal"});
  } catch (err) {
    console.log(err);
  }
};
module.exports.searchsub = async (req, res) => {
  try {
    checkurlfunct.checkurlexamcell(req, res);
    const subdata = await Subject.find({department: req.query.dept, course: req.query.course, semester: req.query.sem});
    if (req.xhr) {
      return res.status(200).json({
        subdata
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.searchcgpa = async (req, res) => {
  try {
    checkurlfunct.checkurlexamcell(req, res);
    const studdata = await Student.find({department: req.query.dept, course: req.query.course, semester: req.query.sem});
    if (req.xhr) {
      return res.status(200).json({
        studdata
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.setting = async (req, res) => {
  try {
    return res.render("examcell/setting", { title: "Setting" });
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