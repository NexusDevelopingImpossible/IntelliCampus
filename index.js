const express = require('express');
const app = express();
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
const path = require("path");


app.use(sassMiddleware({
  src: './assets/scss',
  dest: './assets/css',
  debug: false, //true for console message
  outputStyle: 'extended',
  prefix: '/css'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressLayouts);

app.use(express.urlencoded());
app.use(express.static('./assets'));

app.set('layout extractStyles', true);
app.set('layout extractScript', true);


app.set('view engine', 'ejs');
app.set('views', './views');




app.use(session({
  name: 'newUSer',
  //TODO change secret before deployment 
  secret: 'fuckyouRanjit',
  saveUninitialized: false,
  resave: false,
  cookie: {
      maxAge: (1000 * 60 * 100)
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