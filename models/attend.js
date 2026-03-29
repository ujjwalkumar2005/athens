const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['Present', 'Absent','absent','present'], required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
