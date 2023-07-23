const checkurlfunct = require("./server-function");
const Student = require("../models/student");
const studentsProfile = require("../models/studentProfile");
const SemSection = require("../models/semsection");
const Tempupload = require("../models/templateupoad");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const XLSX = require("xlsx");

module.exports.dashboard = async (req, res) => {
  try {
    checkurlfunct.checkurlfeecell(req, res);
    const deptSem = await SemSection.find();
    res.render("feecell/dashboard", { title: "Dashboard", deptSem});
  } catch (err) {
    console.log(err);
  }
};
module.exports.addfeepending = async (req, res) => {
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
        cellamount = String("C" + i);
        let studreg = String(worksheet[cellreg].v);
        let studdata = await studentsProfile.findOneAndUpdate({regnNo:studreg},{feepending: Number(worksheet[cellamount].v)},{ new: true })
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
module.exports.searchstud = async (req, res) => {
  try {
    checkurlfunct.checkurlfeecell(req, res);
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
    return res.render("feecell/setting", { title: "Setting" });
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