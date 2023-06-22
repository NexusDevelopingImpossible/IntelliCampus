const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    branch: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    teacherid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    subjectcode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        // foreignField: 'code',
        // autopopulate: true,
        required: true,
    },
    classes: [{
        date: {
            type: String,
            required: true
        }
    }]

}, {
    timestamps: true
});


const Timetable = mongoose.model('Timetable', timetableSchema);
module.exports = Timetable;