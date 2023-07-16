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
