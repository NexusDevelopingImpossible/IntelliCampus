const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    subjectid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    studentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    present: [{
        date: {
            type: String,
            required: true
        },
        att: {
            type: Boolean,
            required: true
        }
    }],
    totalpresent: {
        type: Number,
        required: true,
    }

}, {
    timestamps: true
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;