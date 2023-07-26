const nodeMailer = require("../config/nodemailer");


exports.newmail = async function () {


  nodeMailer.transporter.sendMail(
    {
      from: "campusintelli@gmail.com",
      to: "omsinkar03bit@gmail.com",
      subject: "New comment published",
      html: "<h1>Yup, your comment is now published</h1>",
      //   html: htmlString,
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
