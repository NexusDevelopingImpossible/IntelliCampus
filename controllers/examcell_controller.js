const checkurlfunct = require("./server-function");
const Examcell = require("../models/examcell");

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
    res.render("examcell/cgpabacklog", { title: "CGPA & Backlog"});
  } catch (err) {
    console.log(err);
  }
};
module.exports.createsubject = async (req, res) => {
  try {
    checkurlfunct.checkurlexamcell(req, res);
    res.render("examcell/createsubject", { title: "Create Subject"});
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
