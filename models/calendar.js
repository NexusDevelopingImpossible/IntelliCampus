const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    holidaytitle: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

const Calendar = mongoose.model('Calendar', calendarSchema);
module.exports = Calendar;