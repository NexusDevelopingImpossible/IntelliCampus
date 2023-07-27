const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const env = require("./environment");

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "campusintelli@gmail.com",
      pass: "aocpwxqqukyoonrq", // app passwords from 2 step authentication at google security.
    },
});

let renderTemplate = async function (data, relativePath) {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    function (error, template) {
      if (error) {
        console.log("error in rendering the template: ", error);
        return;
      }
      mailHTML = template;
    }
  );
  return mailHTML;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
