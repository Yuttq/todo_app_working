document.addEventListener('DOMContentLoaded', function() {
    // Authentication
    if (document.getElementById('loginForm')) {
        handleLogin();
    } else if (document.getElementById('registerForm')) {
        handleRegister();
    } else {
        // Todo App Functionality
        loadTasks();
        setupEventListeners();
    }
});

// Authentication Functions
function handleLogin() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        fetch('api/auth/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                window.location.href = 'index.php';
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

function handleRegister() {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        fetch('api/auth/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('Registration successful! Please login.');
                window.location.href = 'login.php';
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

// Todo App Functions
function setupEventListeners() {
    // Add new task
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        
        fetch('api/tasks/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, dueDate })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                document.getElementById('taskForm').reset();
                loadTasks();
            }
        })
        .catch(error => console.error('Error:', error));
    });
    
    // Filter buttons
    document.getElementById('showAll').addEventListener('click', () => loadTasks('all'));
    document.getElementById('showActive').addEventListener('click', () => loadTasks('active'));
    document.getElementById('showCompleted').addEventListener('click', () => loadTasks('completed'));
    
    // Clear completed
    document.getElementById('clearCompleted').addEventListener('click', clearCompleted);
}

function loadTasks(filter = 'all') {
    fetch(`api/tasks/read.php?filter=${filter}`)
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskItem.dataset.id = task.id;
                
                taskItem.innerHTML = `
                    <div class="task-checkbox">
                        <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    </div>
                    <div class="task-content">
                        <h3>${task.title}</h3>
                        ${task.description ? `<p>${task.description}</p>` : ''}
                        ${task.due_date ? `<span class="due-date">Due: ${task.due_date}</span>` : ''}
                    </div>
                    <div class="task-actions">
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                `;
                
                taskList.appendChild(taskItem);
                
                // Add event listeners for the new task
                addTaskEventListeners(taskItem, task.id);
            });
        })
        .catch(error => console.error('Error:', error));
}

function addTaskEventListeners(taskItem, taskId) {
    // Checkbox toggle
    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function() {
        fetch('api/tasks/toggle.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: taskId, completed: this.checked })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                taskItem.classList.toggle('completed', this.checked);
            }
        })
        .catch(error => console.error('Error:', error));
    });
    
    // Delete button
    const deleteBtn = taskItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this task?')) {
            fetch(`api/tasks/delete.php?id=${taskId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    taskItem.remove();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });
    
    // Edit button
    const editBtn = taskItem.querySelector('.edit-btn');
    editBtn.addEventListener('click', function() {
        const taskContent = taskItem.querySelector('.task-content');
        const title = taskContent.querySelector('h3').textContent;
        const description = taskContent.querySelector('p')?.textContent || '';
        const dueDate = taskContent.querySelector('.due-date')?.textContent.replace('Due: ', '') || '';
        
        taskContent.innerHTML = `
            <input type="text" class="edit-title" value="${title}">
            <textarea class="edit-description">${description}</textarea>
            <input type="date" class="edit-due-date" value="${dueDate}">
            <div class="edit-actions">
                <button class="save-btn">Save</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        `;
        
        const saveBtn = taskContent.querySelector('.save-btn');
        saveBtn.addEventListener('click', function() {
            const newTitle = taskContent.querySelector('.edit-title').value;
            const newDescription = taskContent.querySelector('.edit-description').value;
            const newDueDate = taskContent.querySelector('.edit-due-date').value;
            
            fetch('api/tasks/update.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: taskId,
                    title: newTitle,
                    description: newDescription,
                    dueDate: newDueDate
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    loadTasks();
                }
            })
            .catch(error => console.error('Error:', error));
        });
        
        const cancelBtn = taskContent.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function() {
            loadTasks();
        });
    });
}

function clearCompleted() {
    fetch('api/tasks/read.php?filter=completed')
        .then(response => response.json())
        .then(tasks => {
            if (tasks.length === 0) {
                alert('No completed tasks to clear!');
                return;
            }
            
            if (confirm(`Are you sure you want to delete ${tasks.length} completed tasks?`)) {
                const deletePromises = tasks.map(task => {
                    return fetch(`api/tasks/delete.php?id=${task.id}`, {
                        method: 'DELETE'
                    });
                });
                
                Promise.all(deletePromises)
                    .then(() => loadTasks())
                    .catch(error => console.error('Error:', error));
            }
        })
        .catch(error => console.error('Error:', error));
}