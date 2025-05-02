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
$taskId = $_GET['id'];
$userId = $_SESSION['user_id'];

// Verify task belongs to user
$task = $db->fetch("SELECT id FROM tasks WHERE id = ? AND user_id = ?", [$taskId, $userId]);

if (empty($task)) {
    http_response_code(404);
    echo json_encode(['error' => 'Task not found']);
    exit();
}

$db->query("DELETE FROM tasks WHERE id = ?", [$taskId]);

echo json_encode(['message' => 'Task deleted successfully']);