module.exports.checkurladmin = (req, res) => {
  console.log(req.session.cookie.expires - Date.now());
  console.log(req.session.cookie.expires - Date.now() > 6000);
  if (res.locals.user === undefined) {
    return res.redirect("/Login");
  }
  if (!(res.locals.user.position === "admin")) {
    return res.redirect("../error");
  }
};
module.exports.checkurlteacher = (req, res) => {
  console.log(req.session.cookie.expires - Date.now());
  console.log(req.session.cookie.expires - Date.now() > 6000);
  if (res.locals.user === undefined) {
    return res.redirect("/Login");
  }
  if (!(res.locals.user.position === "teacher")) {
    return res.redirect("../error");
  }
};
module.exports.checkurlstudent = (req, res) => {
  console.log(req.session.cookie.expires - Date.now());
  console.log(req.session.cookie.expires - Date.now() > 6000);
  if (res.locals.user === undefined) {
    return res.redirect("/Login");
  }
  if (!(res.locals.user.position === "student")) {
    return res.redirect("../error");
  }
};
module.exports.checkurlexamcell = (req, res) => {
  if (res.locals.user === undefined) {
    return res.redirect("/Login");
  }
  if (!(res.locals.user.position === "examcell")) {
    return res.redirect("../error");
  }
};
module.exports.checkurlfeecell = (req, res) => {
  if (res.locals.user === undefined) {
    return res.redirect("/Login");
  }
  if (!(res.locals.user.position === "feecell")) {
    return res.redirect("../error");
  }
};
