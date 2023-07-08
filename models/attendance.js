const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    timetableid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timetable",
      required: true,
    },
    studentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    present: [
      {
        date: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Timetable",
          required: true,
        },
        att: {
          type: Boolean,
          required: true,
        },
        datevalue: {
          type: String
        }
      },
    ],
    examMarks: {
      quiz1: [
        {
          type: Number,
        },
      ],
      quiz2: [
        {
          type: Number,
        },
      ],
      sess1: [
        {
          type: Number,
        },
      ],
      sess2: [
        {
          type: Number,
        },
      ],
    },
    totalpresent: {
      type: Number,
      required: true,
    },
    updateattendance: {
      type: Date
    },
    updateinternal: {
      type: Date
    },
    exitattendance: {
      type: Date
    },
    exitinternal: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
