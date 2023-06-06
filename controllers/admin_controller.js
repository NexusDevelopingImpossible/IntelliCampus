const User = require('../models/user');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Timetable = require('../models/timetable');
const checkurlfunct = require('./server-function');


module.exports.dashboard = (req, res) => {
    checkurlfunct.checkurladmmin(req, res);
    Teacher.find({}, function (err, teacherdata) {
        res.render("admin/dashboard", { title: "Dashboard", teacher: teacherdata });
    });
}
module.exports.addstudent = (req, res) => {
    checkurlfunct.checkurladmmin(req, res);
    return res.render('admin/addstudent', {
        title: "Test"
    })
}
module.exports.addteacher = (req, res) => {
    checkurlfunct.checkurladmmin(req, res);
    return res.render('admin/addteacher', {
        title: "Test"
    })
}
module.exports.allotsubject = (req, res) => {
    checkurlfunct.checkurladmmin(req, res);
    Teacher.find({}, function (err, teacherdata) {
        res.render("admin/allotsubject", { title: "Allot Subject" });
    });
}

module.exports.createstudent = function (req, res) {
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
module.exports.searchteacherid = function (req, res) {
    Teacher.findOne({ username: req.body.registration }, (err, teacherdata) => {
        Timetable.find({ teacherid: req.body.registration }, (err, timetabledata) => {
            return res.render("admin/allotsubjectform", { title: "Allot Subject data", teacher: teacherdata, timetable: timetabledata });
        })
    });
}
module.exports.addsubject = function (req, res) {
    let year;
    // console.log(typeof(parseInt(req.body.semester)));
    switch (parseInt(req.body.semester)) {
        case 1:
            year = 1;
            break;
        case 2:
            year = 1;
            break;
        case 3:
            year = 2;
            break;
        case 4:
            year = 2; 
            break;
        case 5: 
            year = 3; 
            break;
        case 6: 
            year = 3; 
            break;
        case 7: 
            year = 4; 
            break;
        case 8: 
            year = 4; 
            break;
        default:
            console.log('Incorrect semester value.')
            //error to changed later @RAJ
    }
    Timetable.create({
        branch: req.body.branch,
        department: req.body.department,
        year: year,
        semester: req.body.semester,
        section: req.body.section,
        teacherid: req.body.registration,
        subjectcode: req.body.code
    }
        , function (err, newTeacher) {
            if (err) {
                console.log('Error in alloting subject!')
                return;
            }
            console.log('******', newTeacher);
        })
    Teacher.findOne({ username: req.body.registration }, (err, teacherdata) => {
        Timetable.find({ teacherid: req.body.registration }, (err, timetabledata) => {
            return res.render("admin/allotsubjectform", { title: "Allot Subject data", teacher: teacherdata, timetable: timetabledata });
        })
    });
}


