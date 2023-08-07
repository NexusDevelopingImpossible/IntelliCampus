const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const UPLOAD_Path = path.join("/upload/studentassignment/");

const studentassignmentSchema = new mongoose.Schema(
  {
    assignmentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    pdfpath: {
      type: String,
      required: true,
    },
    submittime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", UPLOAD_Path));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname.split(".")[0] + "-" + uniqueSuffix + ".pdf");
  },
});

studentassignmentSchema.statics.uploadedFiles = multer({
  storage: storage,
}).single("file");
studentassignmentSchema.statics.filePath = UPLOAD_Path;

const StudentAssignment = mongoose.model(
  "StudentAssignment",
  studentassignmentSchema
);
module.exports = StudentAssignment;
