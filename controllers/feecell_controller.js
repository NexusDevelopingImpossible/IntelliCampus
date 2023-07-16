const checkurlfunct = require("./server-function");

module.exports.dashboard = async (req, res) => {
  try {
    checkurlfunct.checkurlfeecell(req, res);
    res.render("feecell/dashboard", { title: "Dashboard"});
  } catch (err) {
    console.log(err);
  }
};
