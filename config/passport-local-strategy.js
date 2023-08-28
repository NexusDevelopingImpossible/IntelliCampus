const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passReqToCallback: true,
    },
    async function (req, username, password, done) {
      try {
        // find a user and establish the identity
        const user = await User.findOne({ username: username });

        if (user) {

          if (user.password !== password && user.block>Date.now()) {
            return done(null, user);
          }
          if (user.password !== password) {
            user.point = user.point - 60;
            await user.save();
          }
          if (user.password == password) {
            user.point = user.point - 1;
            await user.save();
            }
          if (user.point == 0) {
            user.block = Date.now() + 5 * 60 * 1000;
            await user.save();
          }
        }

        if (!user || user.password !== password) {
          req.flash("error", " Invalid username/password");
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        // if (!req.headers.referer) {

        // }
        console.log("Error in finding user --> Passport");
        return done(err);
      }
    }
  )
);

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(async function (user, done) {
  try {
    // Assuming user.id is a string or can be converted to a string
    const userId = user.id.toString();
    done(null, userId);
  } catch (err) {
    console.log("Error serializing user --> Passport 1");
    done(err);
  }
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      console.log("User not found --> Passport 2");
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    console.log("Error deserializing user --> Passport 2");
    done(null);
  }
});


// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)

  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return res.redirect("/users/signin");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // console.log(req.isAuthenticated())
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    req.user.password = "fuckyou";
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
