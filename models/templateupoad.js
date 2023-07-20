const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Excelfile = path.join("/upload/temp");

const tempSchema = new mongoose.Schema({


}, {
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", Excelfile));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, "temp" + "-" + uniqueSuffix + "-" + file.originalname);
    },
  });
  
  tempSchema.statics.uploadfileexcel = multer({ storage: storage }).single(
    "fileexcel"
  );
  tempSchema.statics.uploadpath = Excelfile;

const Temp = mongoose.model('Temp', tempSchema);
module.exports = Temp;