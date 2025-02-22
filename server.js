const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = './tasks.json';
const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors()); 
app.use(express.json());  
app.use(express.static('public')); 

let tasks = [];
if (fs.existsSync(path)) {
    const data = fs.readFileSync(path, 'utf-8');
    if (data) {
        tasks = JSON.parse(data);
    }
} else {
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
    fs.writeFileSync(path, JSON.stringify(tasks));
    res.sendStatus(201); // Task created
});

app.put('/tasks/:id', (req, res) => {
    tasks = tasks.map(task => task.id === req.params.id ? { ...task, text: req.body.text } : task);
    fs.writeFileSync(path, JSON.stringify(tasks));
    res.sendStatus(200); 
});

app.put('/tasks/:id/complete', (req, res) => {
    tasks = tasks.map(task => task.id === req.params.id ? { ...task, completed: !task.completed } : task);
    fs.writeFileSync(path, JSON.stringify(tasks));
    res.sendStatus(200); 
});

app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(task => task.id !== req.params.id);
    fs.writeFileSync(path, JSON.stringify(tasks));
    res.sendStatus(200); 
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

