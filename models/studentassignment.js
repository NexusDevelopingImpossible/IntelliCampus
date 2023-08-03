// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const UPLOAD_Path = path.join("/upload/studentassignment/");

// const studentassignmentSchema = new mongoose.Schema(
//   {
//     assignmentid: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Assignment",
//       required: true,
//     },
//     pdfpath: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "..", UPLOAD_Path));
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.originalname.split(".")[0] + "-" + uniqueSuffix + ".pdf");
//   },
// });

// assignmentSchema.statics.uploadedFiles = multer({
//   storage: storage,
// }).single("file");
// assignmentSchema.statics.filePath = UPLOAD_Path;

// const Assignemnt = mongoose.model("Assignment", assignmentSchema);
// module.exports = Assignemnt;
