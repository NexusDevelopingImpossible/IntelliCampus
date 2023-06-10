const checkurlfunct = require('./server-function');
const Teacher = require('../models/teacher');
const Timetable = require('../models/timetable');

module.exports.dashboard=(req,res)=>{
    checkurlfunct.checkurlteacher(req,res);
    Teacher.findOne({ username: res.locals.user.username }, (err, teacherdata) => {
        Timetable.find({ teacherid: res.locals.user.username }, (err, timetabledata) => {
            return res.render("teacher/dashboard", { title: "Dashboard", teacher: teacherdata, timetable: timetabledata });
        })
    });
}
