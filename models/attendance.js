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
    examMarks: [{
        quiz1: {
            type: Number,
        },
        quiz2: {
            type: Number,
        },
        sessiona1: {
            type: Number,
        },
        sessional2: {
            type: Number,
        },

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