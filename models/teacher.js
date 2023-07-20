const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    username: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    semesterco: {
        type: String,
    },
    sectionco: {
        type: String,
    },
    avatar: {
        type: String,
    }

}, {
    timestamps: true
});

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;