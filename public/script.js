async function fetchTasks() {
    const res = await fetch('/tasks');
    const tasks = await res.json();
    document.getElementById('taskList').innerHTML = tasks.map(task => `
        <li class="${task.completed ? 'completed' : ''}">
            <span onclick="toggleComplete('${task.id}')">${task.text} (${task.category})</span>
            <button onclick="editTask('${task.id}')">Edit</button>
            <button onclick="deleteTask('${task.id}')">X</button>
        </li>`).join('');
}

async function addTask() {
    const text = document.getElementById('taskInput').value;
    const category = document.getElementById('category').value;
    await fetch('/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, category }) });
    fetchTasks();
}

async function editTask(id) {
    const newText = prompt('Edit task:');
    if (newText) {
        await fetch(`/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: newText }) });
        fetchTasks();
    }
}

async function toggleComplete(id) {
    await fetch(`/tasks/${id}/complete`, { method: 'PUT' });
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
}

fetchTasks();
