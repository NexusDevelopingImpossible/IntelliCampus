const Attendance = require("../models/attendance");
const TG = require("../models/tg");
const Attendancemail = require("../mailer/attendancemail");

module.exports.attendancemail = async () => {
  let list = await Attendance.find()
    .populate({
      path: "timetableid",
      populate: { path: "subjectcode" },
    })
    .populate("studentid");
  let below = [];
  let tglist = [];
  for (let i = 0; i < list.length; i++) {
    // console.log(list[i].totalpresent / list[i].present);
    if (list[i].totalpresent / list[i].present.length < 0.75) {
        below.push(list[i]);
        if (list[i].studentid.email) {
            Attendancemail.sendattendance(list[i].studentid, list[i]); 
        }
      let ward = await TG.findOne({ studentid: list[i].studentid._id });
      if (ward) {
        tglist.push(ward);
      }
    }
  }
//   employees = below;
//   const groupedByDepartmentAndSemester = employees.reduce(
//     (result, employee) => {
//       const department = employee.studentid.department;
//       const semester = employee.studentid.semester;

//       if (!result[department]) {
//         // result[teacherid].push(tglist);
//         result[department] = {};
//       }

//       if (!result[department][semester]) {
//         result[department][semester] = [];
//       }

//       result[department][semester].push(employee);

//       return result;
//     },
//     {}
//   );
//   const groupedByTG = tglist.reduce((result, tglist) => {
//     const tg = tglist.teacherid;

//     if (!result[teacherid]) {
//       result[teacherid] = [];
//     }

//     return result;
//   }, {});

//   console.log(groupedByDepartmentAndSemester);
//   console.log(groupedByTG);
  return;
};
