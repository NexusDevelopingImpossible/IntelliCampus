const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
    section: {
        type: String,
        required: true
    },
    subjects:[{
        subject1: String,
        required: false
    },
    {
        subject2: String,
        required: false
    }]
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;