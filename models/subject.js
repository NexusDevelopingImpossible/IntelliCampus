const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    credit: {
        type: Number,
        required: true
    },
    numberofclasses: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    }
    

}, {
    timestamps: true
});

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;