const User = require('../models/user');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Timetable = require('../models/timetable');
const Subject = require('../models/subject');
const checkurlfunct = require('./server-function');


//Dashboard 
module.exports.dashboard = (req, res) => {
    checkurlfunct.checkurladmmin(req, res);
    Teacher.find({}, function (err, teacherdata) {
        res.render("admin/dashboard", { title: "Dashboard", teacher: teacherdata });
    });
}
//Add Student Page
module.exports.addstudent = (req, res) => {
    checkurlfunct.checkurladmmin(req, res);
    return res.render('admin/addstudent', {
        title: "Create Student ID"
    })
}
//Add Teacher Page
module.exports.addteacher = (req, res) => {
    checkurlfunct.checkurladmmin(req, res);
    return res.render('admin/addteacher', {
        title: "Create Teacher ID"
    })
}
//Creating new Student id used in Add student page
module.exports.createstudent = function (req, res) {
    var obj = req.body;
    var key = Object.keys(obj);
    var len = key.length;
    for (let i = 0; i < len; i++) {
        User.findOne({ username: req.body[key[i]] }, (err, user) => {
            if (user) {
                console.log("User found in the database.")
            }
            else {
                User.create({
                    username: req.body[key[i]],
                    password: req.body[key[i + 5]],
                    position: "student"
                }
                    , function (err, newUser) {
                        if (err) {
                            console.log('Error in creating a user id!')
                            return;
                        }
                        console.log('******', newUser);
                    })
                Student.create({
                    username: req.body[key[i]],
                    name: req.body[key[i + 1]],
                    department: req.body[key[i + 2]],
                    section: req.body[key[i + 3]],
                    semester: req.body[key[i + 4]]
                }
                    , function (err, newStudent) {
                        if (err) {
                            console.log('Error in creating a new student id!')
                            return;
                        }
                        console.log('******', newStudent);
                    })
            }
            i = i + 5;
        })
    }
    return res.redirect('/admin/dashboard');
}
//Creating a new Teacher id used in Add Teacher page
module.exports.createteacher = function (req, res) {
    var obj = req.body;
    var key = Object.keys(obj);
    var len = key.length;
    for (let i = 0; i < len; i++) {
        User.findOne({ username: req.body[key[i]] }, (err, user) => {
            if (user) {
                console.log("User found in the database.");
            }
            else {
                User.create({
                    username: req.body[key[i]],
                    password: req.body[key[i + 4]],
                    position: "teacher"
                }
                    , function (err, newUser) {
                        if (err) {
                            console.log('Error in creating a user id!')
                            return;
                        }
                        console.log('******', newUser);
                    })
                Teacher.create({
                    username: req.body[key[i]],
                    name: req.body[key[i + 1]],
                    department: req.body[key[i + 2]],
                    position: req.body[key[i + 3]]
                }
                    , function (err, newTeacher) {
                        if (err) {
                            console.log('Error in creating a teacher id!')
                            return;
                        }
                        console.log('******', newTeacher);
                    })
            }
            i = i + 4;
        })
    }
    return res.redirect('/admin/dashboard');
}
//Allot Subject Page
module.exports.allotsubject = (req, res) => {
    checkurlfunct.checkurladmmin(req, res);
    Teacher.find({}, function (err, teacherdata) {
        return res.render("admin/allotsubject", { title: "Allot Subject" });
    });
}
//Searching teacher id from the teacher database for alloting subject used in allot subject page
module.exports.searchteacherid = function (req, res) {
    Teacher.findOne({ username: req.body.registration })
        .exec((err, teacherdata) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error retrieving teacher data");
            }
            if (!teacherdata) {
                return res.redirect('back')
            }
            Timetable.find({ teacherid: req.body.registration })
                .populate('subjectcode')
                .exec((err, timetables) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error retrieving timetable data");
                    }

                    return res.render("admin/allotsubjectform", { title: "Allot Subject data", teacher: teacherdata, timetable: timetables });
                });
        });
}
//Allot Subject to teachers used in allot subject page
module.exports.addsubject = function (req, res) {
    let year;
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
    const subjectCode = req.body.code;
    var subjectName;
    Subject.findOne({ code: subjectCode }, (err, subject) => {
        if (err) {
            console.log("ERROR")
        }
        if (!subject) {
            console.log("Subject not found")
            // Subject not found for the provided subject code
        }
        subjectName = subject._id;
        Timetable.create({
            branch: req.body.branch,
            department: req.body.department,
            year: year,
            semester: req.body.semester,
            section: req.body.section,
            teacherid: req.body.registration,
            subjectcode: subjectName,
            classes: []
        }
            , function (err, newTeacher) {
                if (err) {
                    console.log('Error in alloting subject!')
                    return;
                }
                console.log('******', newTeacher);
            })
    });
    // return res.redirect('back');
    Teacher.findOne({ username: req.body.registration }, (err, teacherdata) => {
        Timetable.find({teacherid: req.body.registration})
            .populate('subjectcode')
            .exec((err, timetables) => {
                if (err) {
                    console.log(err)
                }
                return res.render("admin/allotsubjectform", { title: "Allot Subject data", teacher: teacherdata, timetable: timetables });
            });
    });
}
//Deleting assigned subject from teacher used in allot subject page
module.exports.deletesubject = function (req, res) {
    let id = req.query.id;
    Timetable.findByIdAndDelete(id, function (err) {
        if (err) {
            console.log('error in deleting an object from  database');
            return;
        }
    });
    Teacher.findOne({ _id: req.query.teacherid }, (err, teacherdata) => {
        Timetable.find({username: teacherdata.username})
            .populate('subjectcode')
            .exec((err, timetables) => {
                if (err) {
                    console.log(err)
                }
                return res.render("admin/allotsubjectform", { title: "Allot Subject data", teacher: teacherdata, timetable: timetables });
            });
    });
};


