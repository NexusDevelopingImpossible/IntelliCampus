const mongoose = require("mongoose");

const forgotpasswordSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    otp: {
        type: Number,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model("ForgotPassword", forgotpasswordSchema);
module.exports = ForgotPassword;
