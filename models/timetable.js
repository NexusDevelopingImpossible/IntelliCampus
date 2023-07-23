const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const Notefile = path.join("/upload/note");

const timetableSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    teacherid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    subjectcode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        // foreignField: 'code',
        // autopopulate: true,
        required: true,
    },
    classes: [{
        date: {
            type: String,
            required: true
        }
    }],
    notes: [{
        file: {
            type: String
        },
        type: {
            type: String
        },
        chapter: {
            type: Number
        }
    }]

}, {
    timestamps: true
});
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", Notefile));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
    },
  });
  
  timetableSchema.statics.uploadfile = multer({ storage: storage }).single(
    "notes.file"
  );
  timetableSchema.statics.uploadpath = Notefile;
  

const Timetable = mongoose.model('Timetable', timetableSchema);
module.exports = Timetable;