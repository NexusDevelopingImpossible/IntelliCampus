const User = require("../models/user");
const Admin = require("../models/admin");
const OTP = require("../models/forogotpassword");
const checkurlfunct = require("./server-function");
const forgotpassword = require("../mailer/forgotpassword_mailer");
function generateRandom4DigitNumber() {
  // Generate a random number between 1000 and 9999 (inclusive of 1000 but exclusive of 10000)
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return randomNumber;
}
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
module.exports.fp_forgotpassword = function (req, res) {
  return res.render("login-signup/password1", {
    title: "Forgot Password",
  });
};
module.exports.fp_mail = async function (req, res) {
  let user = await User.findOne({ email: req.query.email });
  if (user) {
    let email = req.query.email;
    let xyz = user._id
    let genotp = generateRandom4DigitNumber();
    OTP.create({
      userid: user._id,
      otp: genotp
    });
    forgotpassword.sendotp(user, genotp);
    return res.render("login-signup/password2", {
      title: "OTP", email, xyz
    });
  }
  else {
    req.flash('error','Incorrect email')
    return res.redirect('back');
  }
};
module.exports.fp_opt = function (req, res) {
  return res.render("login-signup/password2", {
    title: "OTP",
  });
};
module.exports.verifyotp = async function (req, res) {
  let checkopt = req.query.opt1 + req.query.opt2 + req.query.opt3 + req.query.opt4;
  let verotparr = await OTP.find({ userid: String(req.query.xyz) });
  console.log(checkopt)
  console.log(req.query)
  let verotp = verotparr[verotparr.length - 1];
  console.log(verotp);
  let email = req.query.email;
  let xyz = user._id;
  if (verotp.otp === checkopt) {
    return res.render("login-signup/password3", {
      title: "Change password",
    });
  }
  else {
    req.flash('error', 'Incorrect otp');
    return res.render("login-signup/password2", {
      title: "Change password",
      email,
      xyz,
    });
  }
  
};
module.exports.fp_password = function (req, res) {
  return res.render("login-signup/password3", {
    title: "Change password",
  });
};





module.exports.createSession = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the user in the database based on the provided username
    let user = await User.findOne({ username: username });
    // let userdata = await User.
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
  