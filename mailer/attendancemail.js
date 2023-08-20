const nodeMailer = require("../config/nodemailer");

exports.sendattendance = (user, subject) => {
    let DOMmail = "";

  nodeMailer.transporter.sendMail(
    {
      from: "campusintelli@gmail.com",
      to: user.email,
      subject: "Attendance",
      html: `<h1>Hi ${user.name}, Subject: ${subject.timetableid.subjectcode.name}, Attendance: ${((subject.totalpresent/subject.present.length)*100).toFixed(1)}%</h1>`,
    },
    function (error, info) {
      if (error) {
        console.log("error in sending mail: ", error);
        return;
      }
      console.log("message sent: ", info);
      return;
    }
  );
};
