const mongoose = require("mongoose");

const lockinternalSchema = new mongoose.Schema(
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
    lockdate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const LockInternal = mongoose.model("LockInternal", lockinternalSchema);
module.exports = LockInternal;
