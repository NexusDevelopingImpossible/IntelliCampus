const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const UPLOAD_Path = path.join("/upload/teachersProfile/documents");

const teachersProfileSchema = new mongoose.Schema(
  {
    regnNo: {
      type: String,
      required: true,
      unique: true,
    },
    chamber: {
        type: String,
    },
    DOB: {
      type: String,
    },
    gender: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    phoneNoWhatsapp: {
      type: String,
    },
    officialEmail: {
      type: String,
    },
    avatar: {
      type: String,
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
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});



teachersProfileSchema.statics.uploadedFiles = multer({ storage: storage }).single(
  "avatar"
);
teachersProfileSchema.statics.filePath = UPLOAD_Path;

const teachersProfile = mongoose.model(
  "teachersProfile",
  teachersProfileSchema
);
module.exports = teachersProfile;
