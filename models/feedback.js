const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
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
    feedback: {
      type: Array,
    },
    question10: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
