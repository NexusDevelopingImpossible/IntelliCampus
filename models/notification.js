const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Notifile = path.join("/uploads/noti");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    notiflie: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", Notifile));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// static methods
// single means just one file will be uploaded
notificationSchema.statics.uploadfile = multer({ storage: storage }).single(
  "notifile"
);
notificationSchema.statics.uploadpath = Notifile;

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
