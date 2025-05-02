<?php
require_once '../../includes/config.php';
require_once '../../includes/functions.php';
require_once '../../classes/Database.php';

if (!is_logged_in()) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$db = new Database();
$data = json_decode(file_get_contents('php://input'), true);

$taskId = $data['id'];
$completed = $data['completed'] ? 1 : 0;
$userId = $_SESSION['user_id'];

// Verify task belongs to user
$task = $db->fetch("SELECT id FROM tasks WHERE id = ? AND user_id = ?", [$taskId, $userId]);

if (empty($task)) {
    http_response_code(404);
    echo json_encode(['error' => 'Task not found']);
    exit();
}

$db->query("UPDATE tasks SET completed = ? WHERE id = ?", [$completed, $taskId]);

echo json_encode(['message' => 'Task status updated']);