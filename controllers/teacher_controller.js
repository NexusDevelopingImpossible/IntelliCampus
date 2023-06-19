const checkurlfunct = require("./server-function");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timetable");
const Student = require("../models/student");
const Attendance = require("../models/attendance");
const MarksScheme = require("../models/marksScheme");

//Dashboard
module.exports.dashboard = (req, res) => {
  checkurlfunct.checkurlteacher(req, res);
  Teacher.findOne(
    { username: res.locals.user.username },
    (err, teacherdata) => {
      Timetable.find({ teacherid: res.locals.user.username })
        .populate("subjectcode")
        .exec((err, timetabledata) => {
          if (err) {
            console.log(err);
          }
          return res.render("teacher/dashboard", {
            title: "Dashboard",
            teacher: teacherdata,
            timetable: timetabledata,
          });
        });
    }
  );
};

//Allot subject to student page
module.exports.allotsubject = (req, res) => {
  checkurlfunct.checkurlteacher(req, res);
  Timetable.find({ teacherid: res.locals.user.username })
    .populate("subjectcode")
    .exec((err, timetabledata) => {
      if (err) {
        console.log(err);
      }
      return res.render("teacher/allotsubject", {
        title: "Allot Subject",
        timetable: timetabledata,
      });
    });
};

//Searching the student in the student database to allot subject
module.exports.searchstudent = (req, res) => {
  checkurlfunct.checkurlteacher(req, res);
  Timetable.findOne({ _id: req.params.id })
    .populate("subjectcode")
    .exec((err, timetabledata) => {
      if (err) {
        console.log(err);
      }
      Student.find(
        {
          department: timetabledata.department,
          semester: timetabledata.semester,
          section: timetabledata.section,
        },
        (err, studentdata) => {
          if (timetabledata.subjectcode.type === "Theory") {
            for (let i = 0; i < studentdata.length; i++) {
              console.log(timetabledata._id)
              Attendance.create(
                {
                  timetableid: timetabledata._id,
                  studentid: studentdata[i]._id,
                  present: [],
                  totalpresent: 0,
                  examMarks: []
                },
                function (err, newAttendance) {
                  if (err) {
                    console.log("Error in creating a attendance id!");
                    return;
                  }
                  console.log("******", newAttendance);
                }
              );
            }
          }
          return res.redirect("back");
        }
      );
    });
};

//attendance page
module.exports.getsubject = async (req, res) => {
  checkurlfunct.checkurlteacher(req, res);
  let timeTableCode = req.query.id;
  try {
    const timetables = await Timetable.findOne({ _id: req.query.id }).populate("subjectcode").exec();
    const data = await Attendance.find({ timetableid: timetables._id }).populate("timetableid studentid").exec();
    data.sort();

    let marksData = await MarksScheme.findOne({
      timeTableId: timeTableCode,
    });
    marksData=JSON.stringify(marksData)

    let attendanceInfo=await Attendance.find({});
    let studentInfo=await Student.find({}).sort();
    return res.render("teacher/subject", {
      title: "Attendance",
      timetable: timetables,
      student: data,
      timeTableCode: timeTableCode,
      marksData: marksData,
      attendanceInfo:attendanceInfo,
      studentInfo:studentInfo,
    });
  } catch (err) {
    console.log(err);
  }
};


//Add new attendance
module.exports.addattendance = async (req, res) => {
  try {
    checkurlfunct.checkurlteacher(req, res);
    const check = req.body.check;
    let dateadd = await Timetable.findById(req.body.id);
    const newdate = {
      date: req.body.date,
    };
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
        att: attvalue,
      };
      data.present.push(newpresent);
      data.save();
    }
    let timetables = await Timetable.findOne({ _id: req.body.id }).populate(
      "subjectcode"
    );

    let attendancedata = await Attendance.find({
      subjectid: timetables.subjectcode._id,
    }).populate("timetableid studentid");
    attendancedata.sort();
    return res.redirect("back");
  } catch (err) {
    console.log(err);
    return;
  }
};

//view attendance of single student
module.exports.viewstudentattendance = (req, res) => {
  Attendance.findOne({ _id: req.query.id })
    .populate("timetableid studentid")
    .exec((err, data) => {
      data.present.sort();
      return res.render("teacher/attendanceviewsingle", {
        title: "Attendance",
        student: data,
      });
    });
};


module.exports.updateMarks=async(req,res)=>{
  let marksInfo=req.body
  const examType = marksInfo.examType;
  delete marksInfo.examType;
  if(examType=='quiz1'){
    for(let i=0;i<marksInfo.setMarks.length;i++){
      let marks=marksInfo.setMarks[i]
      let marksDefault=marksInfo.setDefaultMarks[i]
      let attendanceId=marksInfo.attendanceIdInfo[i]
      let attendanceUserInfo=await Attendance.findByIdAndUpdate(attendanceId,{
        $set:{
          'examMarks.quiz1': [marks, marksDefault]
        }
      })
    }
  }
  else if(examType=='quiz2'){
    for(let i=0;i<marksInfo.setMarks.length;i++){
      let marks=marksInfo.setMarks[i]
      let marksDefault=marksInfo.setDefaultMarks[i]
      let attendanceId=marksInfo.attendanceIdInfo[i]
      let attendanceUserInfo=await Attendance.findByIdAndUpdate(attendanceId,{
        $set:{
          'examMarks.quiz2': [marks, marksDefault]
        }
      })
    }
  }
  else if(examType=='sess1'){
    for(let i=0;i<marksInfo.setMarks.length;i++){
      let marks=marksInfo.setMarks[i]
      let marksDefault=marksInfo.setDefaultMarks[i]
      let attendanceId=marksInfo.attendanceIdInfo[i]
      let attendanceUserInfo=await Attendance.findByIdAndUpdate(attendanceId,{
        $set:{
          'examMarks.sess1': [marks, marksDefault]
        }
      })
    }
  }
  else if(examType=='sess2'){
    for(let i=0;i<marksInfo.setMarks.length;i++){
      let marks=marksInfo.setMarks[i]
      let marksDefault=marksInfo.setDefaultMarks[i]
      let attendanceId=marksInfo.attendanceIdInfo[i]
      let attendanceUserInfo=await Attendance.findByIdAndUpdate(attendanceId,{
        $set:{
          'examMarks.sess2': [marks, marksDefault]
        }
      })
    }
  }
  res.redirect('back');


}