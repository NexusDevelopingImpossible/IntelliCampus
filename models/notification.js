const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Notifile = path.join("/upload/noti");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    notiflie: {
      type: String,
      // required: true,
    }
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
    const uniqueSuffix = Date.now();
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

notificationSchema.statics.uploadfile = multer({ storage: storage }).single(
  "notifile"
);
notificationSchema.statics.uploadpath = Notifile;

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
