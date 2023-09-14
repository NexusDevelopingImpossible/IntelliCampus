const MicrosoftStrategy = require('passport-microsoft').Strategy;
const passport = require('passport');
var MICROSOFT_GRAPH_CLIENT_ID = 'afa6a1bc-c7c9-4e47-843c-3d09d082d268';
var MICROSOFT_GRAPH_CLIENT_SECRET = '3It8Q~7tVDegc.LIWhKEZAgaobSmCEp_OOnQGdc3';
const User = require("../models/user");

passport.use(new MicrosoftStrategy({
  clientID: MICROSOFT_GRAPH_CLIENT_ID,
  clientSecret: MICROSOFT_GRAPH_CLIENT_SECRET,
  callbackURL: 'https://intellicampus.in/auth/microsoft/redirect',
  scope: ['user.read']
},
function (accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    // console.log(profile);
    // console.log(profile.emails[0].value)
    User.findOne({email: profile.emails[0].value }).exec(function(err, userdata){
      return done(null, userdata);

    });
  });
}
));


module.exports = passport;