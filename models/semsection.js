const mongoose = require('mongoose');

const semsectionSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true
    },
    course: {
        type: String,
    },
    semester: {
        type: Number,
    },
    semesterCoordinator: {
        type: String,
    },
    section: {
        type: String,
    },
    sectionCoordinator: {
        type: String,
    },

}, {
    timestamps: true
});

const SemSection = mongoose.model('SemSection', semsectionSchema);
module.exports = SemSection;