<?php
require_once '../../includes/config.php';
require_once '../../includes/functions.php';
require_once '../../classes/Database.php';

$db = new Database();
$data = json_decode(file_get_contents('php://input'), true);

$username = sanitize($data['username']);
$password = password_hash($data['password'], PASSWORD_BCRYPT);

// Check if username exists
$result = $db->fetch("SELECT id FROM users WHERE username = ?", [$username]);

if (!empty($result)) {
    http_response_code(400);
    echo json_encode(['error' => 'Username already exists']);
    exit();
}

// Insert new user
$db->query("INSERT INTO users (username, password) VALUES (?, ?)", [$username, $password]);

echo json_encode(['message' => 'Registration successful']);