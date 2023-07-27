const nodeMailer = require("../config/nodemailer");
exports.sendotp = (user, otp) => {
  nodeMailer.transporter.sendMail(
    {
      from: "campusintelli@gmail.com",
      to: user.email,
      subject: "OTP for Intellicampus",
      html: `<h1>${otp}</h1>`,
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
