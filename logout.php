<?php
session_start(); // Start the session (if not already started)
session_destroy(); // Destroy all session data

// Redirect to login page (or home page)
header("Location: login.php");
exit(); // Always call exit() after header redirect
?>