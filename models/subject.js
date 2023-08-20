const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    theorytype: {
        type: String,
        required: true
    },
    credit: {
        type: Number,
        required: true
    },
    numberofclasses: {
        type: Number,
    },
    

}, {
    timestamps: true
});

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;