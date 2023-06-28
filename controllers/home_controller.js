const User = require("../models/user");
const Admin = require("../models/admin");
const checkurlfunct = require("./server-function");

module.exports.home = function (req, res) {
  return res.redirect("/Login");
};

module.exports.Login = function (req, res) {
  return res.render("login-signup/Login", {
    title: "Login",
  });
};
module.exports.error = function (req, res) {
  return res.render("components/error404", {
    title: "error",
  });
};

module.exports.signUp = (req, res) => {
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
    await Admin.create(req.body);
    return res.redirect("/Login");
  } catch (err) {
    console.log(err);
  }
};

module.exports.createSession = async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(req.body)
    // Find the user in the database based on the provided username
    let user = await User.findOne({ username: username });
    if (!user || user.password !== password) {
      // User not found or password is incorrect
      // req.flash("Error", "User not found or password is incorrect");
      return res.redirect("/");
    }
    const updatedUser = await User.findOneAndUpdate(
      { username: req.body.username },
      {
        $set: {
          logintime: Date.now(),
        },
      },
      { new: true }
    );
    //   console.log(updatedUser);
    // Redirect to different routes based on the user's type
    if (user.position === "student") {
      return res.redirect("/student/dashboard");
    } else if (user.position === "teacher") {
      return res.redirect("/teacher/dashboard");
    } else if (user.position === "admin") {
      return res.redirect("/admin/dashboard");
    } else {
      return res.redirect("login-signup/signup");
    }
  } catch (error) {}
};

module.exports.destroySession = async function (req, res) {
  // console.log(res.locals)
  await User.findByIdAndUpdate(res.locals.user._id, {
    $set: {
      exittime: Date.now(),
    },
  });
  // logout has been upgraded as an asynchronous function so it requires a callback function to handle error now
  req.logout(function (error) {
    if (error) {
      return next(error);
    }
    return res.redirect("/");
  });
};
