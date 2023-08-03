const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const UPLOAD_Path = path.join("/upload/attendancegrant/");

const attendancegrantSchema = new mongoose.Schema(
  {
    assignmentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    pdfpath: {
      type: String,
      required: true,
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

attendancegrantSchema.statics.uploadedFiles = multer({
  storage: storage,
}).single("file");
attendancegrantSchema.statics.filePath = UPLOAD_Path;

const AttendanceGrant = mongoose.model(
  "AttendanceGrant",
  attendancegrantSchema
);
module.exports = AttendanceGrant;
