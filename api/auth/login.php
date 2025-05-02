<?php
require_once '../../includes/config.php';
require_once '../../includes/functions.php';
require_once '../../classes/Database.php';

$db = new Database();
$data = json_decode(file_get_contents('php://input'), true);

$username = sanitize($data['username']);
$password = $data['password'];

$user = $db->fetch("SELECT * FROM users WHERE username = ?", [$username]);

if (empty($user) || !password_verify($password, $user[0]['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit();
}

$_SESSION['user_id'] = $user[0]['id'];
$_SESSION['username'] = $user[0]['username'];

echo json_encode(['message' => 'Login successful']);