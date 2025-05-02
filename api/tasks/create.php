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

$title = sanitize($data['title']);
$description = sanitize($data['description']);
$dueDate = sanitize($data['dueDate']);
$userId = $_SESSION['user_id'];

$db->query(
    "INSERT INTO tasks (user_id, title, description, due_date) VALUES (?, ?, ?, ?)",
    [$userId, $title, $description, $dueDate]
);

echo json_encode(['message' => 'Task added successfully']);