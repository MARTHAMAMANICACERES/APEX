<?php
session_start();
require_once '../../config/constants.php';

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: ../../index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - <?php echo APP_NAME; ?></title>
    <link rel="stylesheet" href="../../public/css/styles.css">
    <link rel="stylesheet" href="../../public/css/responsive.css">
</head>
<body>
    <div class="container">
        <div class="form-container">
            <h1 class="form-title">Welcome Back</h1>
            <p class="text-center mb-4">Sign in to your account</p>
            
            <form class="auth-form" data-action="login">
                <div class="form-group">
                    <label for="email" class="form-label">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        class="form-input" 
                        required 
                        placeholder="Enter your email"
                    >
                </div>
                
                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        class="form-input" 
                        required 
                        placeholder="Enter your password"
                    >
                </div>
                
                <button type="submit" class="btn btn-primary btn-full" data-original-text="Sign In">
                    Sign In
                </button>
            </form>
            
            <div class="text-center mt-4">
                <p>Don't have an account? 
                    <a href="register.php" class="text-primary">Sign up here</a>
                </p>
            </div>
        </div>
    </div>
    
    <script src="../../public/js/api.js"></script>
    <script src="../../public/js/ui.js"></script>
    <script src="../../public/js/app.js"></script>
</body>
</html>
