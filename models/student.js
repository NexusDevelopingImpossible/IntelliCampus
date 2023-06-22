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
    semester: {
        type: Number,
        required: true
    },
    section: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
//add B.TEch, Phd, TG name @OM/@Raj
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;