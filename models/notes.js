const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const UPLOAD_Path = path.join("/upload/notes/");

const notesSchema = new mongoose.Schema(
  {
    timetableid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timetable",
      required: true,
    },
    notes: [
      {
        name: {
          type: String,
        },
        path: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
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
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

notesSchema.statics.uploadedFiles = multer({
  storage: storage,
}).array("fileexcel", 5);
notesSchema.statics.filePath = UPLOAD_Path;

// studentsProfileSchema.statics.uploadedFiles = multer({
//   storage: storage,
// }).single("avatar");
// studentsProfileSchema.statics.filePath = UPLOAD_Path;

const Subjectnotes = mongoose.model(
  "Subjectnotes",
  notesSchema
);
module.exports = Subjectnotes;
