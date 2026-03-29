const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    date: { type: String, required: true },
    // I removed the 'enum' restriction so any string works, 
    // or you can add lowercase versions to the list.
    status: { type: String, required: true } 
});

module.exports = mongoose.model('Attendance', attendanceSchema);
