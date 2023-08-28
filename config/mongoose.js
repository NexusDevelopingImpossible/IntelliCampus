const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();


// const env = require('./environment');

// mongoose.connect("mongodb://localhost/ECM");

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


// db.once('open', function () {
//         console.log("Connected to Database :: MongoDB/");
//     });
    

// module.exports = db;



const uri = "mongodb+srv://omsinkar03bit:WBl5pvvuWTQmeHS9@intellicampus.yc6cf9z.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery', false);

const start = async() => {
    try{
        await mongoose.connect(uri);

    }
    catch (err) {
        router.use((err, req, res, next) => {
          if (errorConfig[err.code]) {
            res.redirect(errorConfig[err.code]);
          } else {
            // Default error handling
            return res.render("components/error404");;
          }
        });
        console.log("Mongoose: ",err); 
    }

}
start()
