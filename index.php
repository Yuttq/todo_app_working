<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if (!is_logged_in()) {
    redirect('login.php');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Welcome, <?php echo $_SESSION['username']; ?>!</h1>
            <a href="logout.php" class="logout-btn">Logout</a>
        </header>
        
        <div class="todo-container">
            <form id="taskForm">
                <input type="text" id="taskTitle" placeholder="Task title" required>
                <textarea id="taskDescription" placeholder="Description"></textarea>
                <input type="date" id="taskDueDate">
                <button type="submit">Add Task</button>
            </form>
            
            <div class="task-filters">
                <button id="showAll">All</button>
                <button id="showActive">Active</button>
                <button id="showCompleted">Completed</button>
                <button id="clearCompleted">Clear Completed</button>
            </div>
            
            <ul id="taskList"></ul>
        </div>
    </div>
    <script src="assets/js/script.js"></script>
</body>
</html>