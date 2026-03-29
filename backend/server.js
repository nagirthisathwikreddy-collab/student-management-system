const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

const dbPath = path.join(__dirname, '../database/students.json');

// Ensure database file exists with dummy data
if (!fs.existsSync(dbPath)) {
    const defaultData = [
        { id: "101", name: "Alice Smith", course: "Computer Science", email: "alice@example.com" },
        { id: "102", name: "Bob Johnson", course: "Mathematics", email: "bob@example.com" },
        { id: "103", name: "Charlie Brown", course: "Physics", email: "charlie@example.com" }
    ];
    fs.mkdirSync(path.join(__dirname, '../database'), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
}

// Simple hardcoded login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Hardcoded credentials for mini-project simplicity
    if (username === 'admin' && password === 'admin') {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Get all students
app.get('/api/students', (req, res) => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read database' });
    }
});

// Add a student
app.post('/api/students', (req, res) => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        const students = JSON.parse(data);
        const newStudent = req.body;
        
        // Basic validation for existing ID
        if(students.find(s => s.id === newStudent.id)) {
            return res.status(400).json({ error: 'Student ID already exists' });
        }
        
        students.push(newStudent);
        fs.writeFileSync(dbPath, JSON.stringify(students, null, 2));
        res.status(201).json({ message: 'Student added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update database' });
    }
});

// Update a student
app.put('/api/students/:id', (req, res) => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        let students = JSON.parse(data);
        const studentId = req.params.id;
        const index = students.findIndex(s => s.id === studentId);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        students[index] = { ...students[index], ...req.body };
        fs.writeFileSync(dbPath, JSON.stringify(students, null, 2));
        res.json({ message: 'Student updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update database' });
    }
});

// Delete a student
app.delete('/api/students/:id', (req, res) => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        let students = JSON.parse(data);
        const studentId = req.params.id;
        
        const newStudents = students.filter(s => s.id !== studentId);
        if (students.length === newStudents.length) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        fs.writeFileSync(dbPath, JSON.stringify(newStudents, null, 2));
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update database' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
