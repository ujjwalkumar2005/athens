const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Attendance = require('./models/attend');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendanceDB')
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("Could not connect to MongoDB:", err));

// Route to mark attendance
app.post('/api/mark', async (req, res) => {
    try {
        const record = new Attendance(req.body);
        await record.save();
        res.status(201).json({ message: "Attendance saved successfully!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET Route: Fetch all attendance records
app.get('/api/records', async (req, res) => {
    try {
        const records = await Attendance.find(); // Pulls everything from MongoDB
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// DELETE Route: Clear all records from the collection
app.delete('/api/clear-all', async (req, res) => {
    try {
        await Attendance.deleteMany({}); // {} means "match everything"
        res.status(200).json({ message: "All attendance records have been deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});