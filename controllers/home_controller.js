const User = require("../models/user");
const Admin = require("../models/admin");
const OTP = require("../models/forogotpassword");
const checkurlfunct = require("./server-function");
const forgotpassword = require("../mailer/forgotpassword_mailer");
function generateRandom4DigitNumber() {
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return randomNumber;
}
module.exports.home = function (req, res) {
  return res.redirect("/Login");
};

module.exports.Login = function (req, res) {
  console.log(res.locals);
  return res.render("login-signup/Login", {
    title: "Login",
  });
};
module.exports.showRateLimitExceededPage = function (req, res) {
  // console.log(res.locals);
  return res.render("components/limit", {
    title: "Limit",
  });
};
module.exports.error = function (req, res) {
  return res.render("components/error404", {
    title: "Error",
  });
};
module.exports.fp_forgotpassword = function (req, res) {
  return res.render("login-signup/password1", {
    title: "Forgot Password",
  });
};
module.exports.nexus = function (req, res) {
  return res.render("login-signup/developer", {
    title: "Nexus Team",
  });
};
module.exports.fp_mail = async function (req, res) {
  console.log(res.locals);
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    let email = req.body.email;
    let genotp = generateRandom4DigitNumber();
    OTP.create({
      userid: user._id,
      otp: genotp
    });
    forgotpassword.sendotp(user, genotp);
    if (req.xhr) {
      return res.status(200).json({
        email, user
      });
    }
  }
  else {
    if (req.xhr) {
      return res.status(200).json({
        data: "0",
      });
    } 
  }
};

module.exports.verifyotp = async function (req, res) {
  let checkopt = req.body.opt1 + req.body.opt2 + req.body.opt3 + req.body.opt4;
  let verotparr = await OTP.find({ userid: String(req.body.id) });
  let verotp = verotparr[verotparr.length - 1];
  let email = req.body.email;
  if (verotp.otp == checkopt) {
    console.log('match');
    if (req.xhr) {
      return res.status(200).json({
        user: req.body.id,
      });;
    }
  }
  else {
    console.log("unmatch")
    if (req.xhr) {
      return res.status(200).json({
        data: "0",
      });;
    }
  }
  
};
module.exports.fp_password = async function (req, res) {
  console.log(req.body);
  if (req.body.password == req.body.password1) {
    let user = await User.findById(req.body.id);
    user.password = req.body.password;
    await user.save();
  }
  else {
    req.flash('error', 'Both password dont match.')
    return res.redirect('back');
  }
  return res.redirect('/Login')
};





module.exports.createSession = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the user in the database based on the provided username
    let user = await User.findOne({ username: username });
    // let userdata = await User.
    if (!user || user.password !== password) {
      // User not found or password is incorrect
      req.flash("Error", "User not found or password is incorrect");
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
    }else if (user.position === "examcell") {
      return res.redirect("/examcell/dashboard");
    }else if (user.position === "feecell") {
      return res.redirect("/feecell/dashboard");
    }else {
      return res.redirect("login-signup/signup");
    }
  } catch (error) {}
};
module.exports.micin = async function (req, res) {
  let user = await User.findById(req.user._id);
  if(!user){
    return res.redirect("/");
  }
  if (user.position === "student") {
    return res.redirect("/student/dashboard");
  } else if (user.position === "teacher") {
    return res.redirect("/teacher/dashboard");
  } else if (user.position === "admin") {
    return res.redirect("/admin/dashboard");
  } else {
    return res.redirect("login-signup/signup");
  }
}

module.exports.destroySession = async function (req, res) {
  console.log(res.locals)
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
  