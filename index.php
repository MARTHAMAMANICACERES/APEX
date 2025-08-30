<?php
session_start();
require_once 'config/database.php';
require_once 'config/constants.php';

// Redirect to login if not authenticated
if (!isset($_SESSION['user_id'])) {
    header('Location: views/auth/login.php');
    exit();
}

// Redirect to appropriate page based on user state
if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'token':
            header('Location: views/payment/token-entry.php');
            break;
        case 'payment':
            header('Location: views/payment/payment-options.php');
            break;
        case 'profile':
            header('Location: views/user/profile.php');
            break;
        default:
            header('Location: views/payment/token-entry.php');
    }
} else {
    header('Location: views/payment/token-entry.php');
}
exit();
?>
