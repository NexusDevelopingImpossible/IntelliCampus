const express = require('express');
const env = require('./config/environment');
const microsoft = require('./config/microsoft_oauth');
const logger = require('morgan') 
const app = express();
require('./config/view-helpers')(app)
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const sassMiddleware = require('node-sass-middleware');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const cookieParser = require('cookie-parser');
const MongoStore = require("connect-mongo");
const db = require('./config/mongoose');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const bodyParser = require("body-parser");
const path = require('path');
const prettydate = require("pretty-date"); //

if(env.name == "development"){
  app.use(sassMiddleware({
    src: path.join(__dirname, env.asset_path, 'scss'),
    dest: path.join(__dirname, env.asset_path, 'css'),
    debug: false, //true for console message
    outputStyle: 'extended',
    prefix: '/css'
  }));
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.urlencoded());
// console.log(__dirname + '\\public\\assets\\')
// app.use(express.static(__dirname + '/public/assets/'));  //production using public
// app.use(express.static(__dirname + './assets'));   //production using assets
app.use(express.static('./assets'));    //depolyment using assets


app.use('/upload', express.static(__dirname + '/upload'));
app.use('/data', express.static(__dirname + '/data'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true)


app.set('view engine', 'ejs');
app.set('views', './views');




app.use(session({
  name: 'newUSer',
  //TODO change secret before deployment 
  secret: env.session_cookie_key,
  saveUninitialized: false,
  resave: false,
  cookie: {
      maxAge: (10000 * 60 * 100)
  },
  store: MongoStore.create({
      mongooseConnection: db,
      autoRemove: "disabled",
      // Added next line from stackoverflow to remove the (session) parameter from line 13
      mongoUrl: 'mongodb://localhost/newECM' //change database name 
    }),function(error){
      console.log(error || 'connect-mongodb setup okay');
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running thr server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
})