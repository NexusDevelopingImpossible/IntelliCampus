const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Excelfile = path.join("/upload/tg");

const tgSchema = new mongoose.Schema({
      studentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      teacherid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
      }

}, {
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", Excelfile));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, "TGward" + "-" + uniqueSuffix + "-" + file.originalname);
    },
  });
  
  tgSchema.statics.uploadfileexcel = multer({ storage: storage }).single(
    "fileexcel"
  );
  tgSchema.statics.uploadpath = Excelfile;

const TG = mongoose.model('TG', tgSchema);
module.exports = TG;