const mongoose = require("mongoose");

const studentreportSchema = new mongoose.Schema(
  {
    studentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
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

const StudentReport = mongoose.model("StudentReport", studentreportSchema);
module.exports = StudentReport;
