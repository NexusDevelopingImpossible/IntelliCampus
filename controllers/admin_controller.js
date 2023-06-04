const User = require('../models/user');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const checkurlfunct = require('./server-function')

module.exports.dashboard = (req, res) => {
    checkurlfunct.checkurladmmin(req, res);
    return res.render('adminDashboard', {
        title: "Test Admin"
    })
}
module.exports.addstudent = (req, res) => {
    checkurlfunct.checkurladmmin(req, res);
    return res.render('addstudent', {
        title: "Test"
    })
}
module.exports.addteacher = (req, res) => {
    checkurlfunct.checkurladmmin(req, res);
    return res.render('addteacher', {
        title: "Test"
    })
}
module.exports.createstudent = function (req, res) {
    checkurlfunct.checkurladmin(req, res);
    var count = req.body.counter;
    var obj = req.body;
    var key = Object.keys(obj);
    var len = key.length;
    for (let i = 0; i < len; i++) {
        User.create({
            username: req.body[key[i]],
            password: req.body[key[i + 2]],
            position: "student"
        }
            , function (err, newStudent) {
                if (err) {
                    console.log('Error in creating a contact!')
                    return;
                }
                console.log('******', newStudent);
            })
        Student.create({
            username: req.body[key[i]],
            name: req.body[key[i + 1]],
            department: NaN,
            section: NaN,
        }
            , function (err, newStudent) {
                if (err) {
                    console.log('Error in creating a contact!')
                    return;
                }
                console.log('******', newStudent);
            })
        // // console.log("ID: "+ i)
        // console.log(req.body[key[i]])
        // // console.log(req.body[key[i+1]])
        // console.log(req.body[key[i+2]]);
        i = i + 2;
    }
    return res.redirect('/admin/dashboard');

}
module.exports.createteacher = function (req, res) {
    checkurlfunct.checkurladmin(req, res);
    var count = req.body.counter;
    var obj = req.body;
    // console.log(obj);
    var key = Object.keys(obj);
    var len = key.length;
    // console.log(len);
    for (let i = 0; i < len; i++) {
        User.create({
            username: req.body[key[i]],
            password: req.body[key[i + 2]],
            position: "teacher"
        }
            , function (err, newTeacher) {
                if (err) {
                    console.log('Error in creating a Teacher!')
                    return;
                }
                console.log('******', newTeacher);
            })
        Teacher.create({
            username: req.body[key[i]],
            name: req.body[key[i + 1]],
            department: NaN
        }
            , function (err, newTeacher) {
                if (err) {
                    console.log('Error in creating a Teacher!')
                    return;
                }
                console.log('******', newTeacher);
            })
        i = i + 2;
    }
    return res.redirect('/admin/dashboard');
}
