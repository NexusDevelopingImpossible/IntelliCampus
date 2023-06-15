const checkurlfunct = require('./server-function');
const Teacher = require('../models/teacher');
const Timetable = require('../models/timetable');
const Student = require('../models/student');
const Attendance = require('../models/attendance');

//Dashboard
module.exports.dashboard = (req, res) => {
    checkurlfunct.checkurlteacher(req, res);
    Teacher.findOne({ username: res.locals.user.username }, (err, teacherdata) => {
        Timetable.find({ teacherid: res.locals.user.username })
            .populate('subjectcode')
            .exec((err, timetabledata) => {
                if (err) {
                    console.log(err)
                }
                return res.render("teacher/dashboard", { title: "Dashboard", teacher: teacherdata, timetable: timetabledata });
            });
    });
}

//Allot subject to student page 
module.exports.allotsubject = (req, res) => {
    checkurlfunct.checkurlteacher(req, res);
    Timetable.find({ teacherid: res.locals.user.username })
        .populate('subjectcode')
        .exec((err, timetabledata) => {
            if (err) {
                console.log(err)
            }
            return res.render('teacher/allotsubject', {
                title: "Allot Subject", timetable: timetabledata
            })
        });
}

//Searching the student in the student database to allot subject
module.exports.searchstudent = (req, res) => {
    checkurlfunct.checkurlteacher(req, res);
    Timetable.findOne({ _id: req.body.id })
        .populate('subjectcode')
        .exec((err, timetabledata) => {
            if (err) {
                console.log(err)
            }
            Student.find({ department: timetabledata.department, semester: timetabledata.semester, section: timetabledata.section }, (err, studentdata) => {
                if (timetabledata.subjectcode.type === "Theory") {
                    for (let i = 0; i < studentdata.length; i++) {
                        Attendance.create({
                            subjectid: timetabledata.subjectcode._id,
                            studentid: studentdata[i]._id,
                            present: [],
                            totalpresent: 0
                        }
                            , function (err, newAttendance) {
                                if (err) {
                                    console.log('Error in creating a attendance id!')
                                    return;
                                }
                                console.log('******', newAttendance);
                            })
                    }
                }
                return res.redirect("back");
            })
        });
}

//attendance page
module.exports.getsubject = (req, res) => {
    checkurlfunct.checkurlteacher(req, res);
    Timetable.findOne({ _id: req.query.id })
        .populate('subjectcode')
        .exec((err, timetables) => {
            if (err) {
                console.log(err)
            }
            Attendance.find({ subjectid: timetables.subjectcode._id })
                .populate('subjectid studentid')
                .exec((err, data) => {
                    const filterdata = data.filter(student => (student.studentid.department === timetables.department && student.studentid.semester === timetables.semester && student.studentid.section === timetables.section));
                    filterdata.sort()

                    return res.render("teacher/subject", { title: "Attendance", timetable: timetables, student: filterdata });
                });
        });

}

//Add new attendance 
module.exports.addattendance = async (req, res) => {
    try {
        checkurlfunct.checkurlteacher(req, res);
        const check = req.body.check;
        let dateadd = await Timetable.findById(req.body.id);
        const newdate = {
            date: req.body.date
        }
        dateadd.classes.push(newdate);
        dateadd.save();
        for (let i = 0; i < req.body.studentlist.length; i++) {
            

            let data = await Attendance.findById(req.body.studentlist[i]);
            let attvalue = false;
            for (let j = 0; j < check.length; j++) {
                if (check[j] == i) {
                    attvalue = true;
                    data.totalpresent++;
                    break;
                }
            }
            const newpresent = {
                date: req.body.date,
                att: attvalue
            }
            data.present.push(newpresent);
            data.save();
        }
        let timetables = await Timetable.findOne({ _id: req.body.id })
            .populate('subjectcode');

        let attendancedata = await Attendance.find({ subjectid: timetables.subjectcode._id })
            .populate('subjectid studentid')
        const filterdata = attendancedata.filter(student => (student.studentid.department === timetables.department && student.studentid.semester === timetables.semester && student.studentid.section === timetables.section));
        filterdata.sort()
        return res.redirect('back')
    }
    catch (err) {
        console.log(err)
        return
    }
}

//view attendance of single student
module.exports.viewstudentattendance = (req, res) => {
    Attendance.findOne({ _id: req.query.id })
        .populate('subjectid studentid')
        .exec((err, data) => {
            data.present.sort();
            return res.render('teacher/attendanceviewsingle', { title: "Attendance", student: data })
        })
}
