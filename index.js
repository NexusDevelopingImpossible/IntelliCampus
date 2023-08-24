const express = require("express");
const env = require("./config/environment");
const microsoft = require("./config/microsoft_oauth");
const logger = require("morgan");
const app = express();
require("./config/view-helpers")(app);
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const sassMiddleware = require("node-sass-middleware");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const db = require("./config/mongoose");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const bodyParser = require("body-parser");
const path = require("path");
const prettydate = require("pretty-date"); //
const mongoSanitize = require("express-mongo-sanitize");
const cron = require("node-cron");
const cronController = require("./controllers/cron_controller");
const homeController = require("./controllers/home_controller");
const Redis = require("ioredis");
const redisClient = new Redis({ enableOfflineQueue: false });
const { RateLimiterRedis } = require("rate-limiter-flexible");

if (env.name == "development") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "scss"),
      dest: path.join(__dirname, env.asset_path, "css"),
      debug: false, //true for console message
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}
const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  points: 300, // Number of points
  duration: 60, // Per 60 seconds
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(cookieParser());

app.use(express.urlencoded());
// console.log(__dirname + '\\public\\assets\\')
// app.use(express.static(__dirname + '/public/assets/'));  //production using public
// app.use(express.static(__dirname + './assets'));   //production using assets
app.use(express.static("./assets")); //depolyment using assets

app.use("/upload", express.static(__dirname + "/upload"));
app.use("/data", express.static(__dirname + "/data"));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "newUSer",
    //TODO change secret before deployment
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 100000 * 60,
    },
    store: MongoStore.create({
      mongooseConnection: db,
      autoRemove: "disabled",
      // Added next line from stackoverflow to remove the (session) parameter from line 13
      mongoUrl: "mongodb://localhost/newECM", //change database name
    }),
    function(error) {
      console.log(error || "connect-mongodb setup okay");
    },
  })
);
const rateLimiterMiddleware = async (req, res, next) => {
  // req.userId should be set
  console.log(req.user);
  console.log(req.ip);
  const key = req.user ? req.user : req.ip;
  const pointsToConsume = req.user ? 1 : 30;
    try {
      const rateLimiterResponse = await rateLimiterRedis.consume(
        key,
        pointsToConsume
      );
      const remainingPoints = rateLimiterResponse.remainingPoints;

      console.log(`Remaining points for ${key}: ${remainingPoints}`);
      next();
    } catch (error) {
      return homeController.showRateLimitExceededPage(req, res);
    }
};

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(rateLimiterMiddleware);

app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes"));

// // Schedule a task to run on the 15th and 30th days of the month
// // cron.schedule('0 0 15,30 * *', () => {
// cron.schedule("*/100 * * * * *", () => {
//   // This function will be executed every 5 minutes
//   console.log("Running the task...");
//   cronController.attendancemail();
//   // Add your task logic here
// });

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running thr server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
