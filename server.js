const express = require('express');
const fs = require('fs');
const path = './tasks.json';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Ensure tasks.json exists and is not empty
let tasks = [];

// Check if the file exists, and if not, create it
if (fs.existsSync(path)) {
    // If the file exists, read and parse it
    const data = fs.readFileSync(path, 'utf-8');
    if (data) {
        tasks = JSON.parse(data); // Parse the JSON data into the tasks array
    }
} else {
    // If the file doesn't exist, create it with an empty array
    fs.writeFileSync(path, JSON.stringify(tasks));
}

app.get('/tasks', (req, res) => res.json(tasks));

app.post('/tasks', (req, res) => {
    const newTask = { 
        id: Date.now().toString(),
        text: req.body.text,
        category: req.body.category,
        completed: false
    };
    tasks.push(newTask);
    fs.writeFileSync(path, JSON.stringify(tasks));  // Save tasks back to tasks.json
    res.sendStatus(201);  // Created
});

app.put('/tasks/:id', (req, res) => {
    tasks = tasks.map(task => task.id === req.params.id ? { ...task, text: req.body.text } : task);
    fs.writeFileSync(path, JSON.stringify(tasks));  // Save updated tasks
    res.sendStatus(200);  // OK
});

app.put('/tasks/:id/complete', (req, res) => {
    tasks = tasks.map(task => task.id === req.params.id ? { ...task, completed: !task.completed } : task);
    fs.writeFileSync(path, JSON.stringify(tasks));  // Save updated tasks
    res.sendStatus(200);  // OK
});

app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(task => task.id !== req.params.id);
    fs.writeFileSync(path, JSON.stringify(tasks));  // Save updated tasks
    res.sendStatus(200);  // OK
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
