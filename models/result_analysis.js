const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Excelfile = path.join("/upload/data");

const resultanalysisSchema = new mongoose.Schema(
  {
    course: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    subjectcode: {
      type: String,
      required: true
    },
    excelfile: {
      type: String,
      required: true,
    },
    calexcelfile: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", Excelfile));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, "Result_Analysis" + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

resultanalysisSchema.statics.uploadfileexcel = multer({ storage: storage }).single(
  "fileexcel"
);
resultanalysisSchema.statics.uploadpath = Excelfile;

const ResultAnalysis = mongoose.model("ResultAnalysis", resultanalysisSchema);
module.exports = ResultAnalysis;
