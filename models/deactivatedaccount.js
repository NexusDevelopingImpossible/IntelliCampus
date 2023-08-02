const mongoose = require("mongoose");

const deactivatedaccountSchema = new mongoose.Schema(
  {
    username: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    //Deactivate Date and time
    deactDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const DeactivateAccount = mongoose.model(
  "DeactivateAccount",
  deactivatedaccountSchema
);
module.exports = DeactivateAccount;
