const mongoose = require('mongoose');

const marksSchemeSchema = new mongoose.Schema({
    timeTableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timetable',
        required: true,
    },
    examMaxMarks: {
        quiz1: {
            type: Number,
        },
        quiz2: {
            type: Number,
        },
        sess1: {
            type: Number,
        },
        sess2: {
            type: Number,
        },

    },
}, {
    timestamps: true
});

const MarksScheme = mongoose.model('MarkScheme', marksSchemeSchema);
module.exports = MarksScheme;