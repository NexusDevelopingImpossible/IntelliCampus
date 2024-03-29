const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    username: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    deactivatestate: {
      type: Boolean,
    },
    department: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
    },
    section: {
      type: String,
    },
    pinned: [
      {
        noti: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Notification",
        },
      },
    ],
    avatar: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
//add B.TEch, Phd, TG name @OM/@Raj
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
