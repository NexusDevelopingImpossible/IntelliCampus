const checkurlfunct = require('./server-function');
const Student = require('../models/student');

module.exports.dashboard=(req,res)=>{
  checkurlfunct.checkurlstudent(req, res);
    Student.find({username: res.locals.user.username}, function (err, studentdata) {
        res.render("student/dashboard", {title:"Dashboard", student: studentdata});
      });
}
// module.exports.demo=(req,res)=>{
//   checkurlfunct.checkurlstudent(req, res);
//     Student.find({username: res.locals.user.username}, function (err, studentdata) {
//         res.render("student/dashboard", {title:"Student", student: studentdata});
//       });
// }