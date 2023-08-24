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
            console.log(user.point)
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
            user.block = Date.now() + 1 * 60 * 1000;
            await user.save();
          }
        }

        if (!user || user.password !== password) {
          req.flash("error", " Invalid username/password");
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        console.log("Error in finding user --> Passport");
        return done(err);
      }
    }
  )
);

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user --> Passport");
      return done(err);
    }

    return done(null, user);
  });
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
