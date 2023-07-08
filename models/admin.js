const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
      },
    branch: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;