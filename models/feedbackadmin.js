const mongoose = require("mongoose");

const feedbackadminSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },
    course: {
      type: String,
    },
    semester: {
      type: Number,
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const FeedbackAdmin = mongoose.model("FeedbackAdmin", feedbackadminSchema);
module.exports = FeedbackAdmin;
