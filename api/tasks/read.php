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
$userId = $_SESSION['user_id'];
$filter = $_GET['filter'] ?? 'all';

$sql = "SELECT * FROM tasks WHERE user_id = ?";
$params = [$userId];

switch ($filter) {
    case 'active':
        $sql .= " AND completed = FALSE";
        break;
    case 'completed':
        $sql .= " AND completed = TRUE";
        break;
}

$sql .= " ORDER BY created_at DESC";

$tasks = $db->fetch($sql, $params);

echo json_encode($tasks);