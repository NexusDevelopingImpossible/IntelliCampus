const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema(
    {
    department: {
      type: String,
      required: true,
    },
    course: {
      type: String,
    },
    semester: {
      type: Number,
    },
    section: {
      type: String,
    },
    subject: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Mail = mongoose.model("Mail", mailSchema);
module.exports = Mail;
