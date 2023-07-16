const mongoose = require('mongoose');

const examcellSchema = new mongoose.Schema({


}, {
    timestamps: true
});

const Examcell = mongoose.model('Examcell', examcellSchema);
module.exports = Examcell;