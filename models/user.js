const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
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
    logintime: {
      type: Date,
    },
    exittime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;