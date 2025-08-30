<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Security.php';
require_once __DIR__ . '/../utils/Validator.php';

class AuthController {
    private $userModel;
    
    public function __construct() {
        $this->userModel = new User();
    }
    
    public function login($email, $password) {
        try {
            // Validate input
            if (!Security::isValidEmail($email)) {
                throw new Exception('Invalid email format');
            }
            
            if (empty($password)) {
                throw new Exception('Password is required');
            }
            
            // Authenticate user
            $user = $this->userModel->authenticate($email, $password);
            
            if (!$user) {
                throw new Exception('Invalid credentials');
            }
            
            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['login_time'] = time();
            
            return [
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email']
                ]
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    public function register($email, $password, $name, $confirmPassword) {
        try {
            // Validate input
            if (!Security::isValidEmail($email)) {
                throw new Exception('Invalid email format');
            }
            
            if (strlen($password) < 8) {
                throw new Exception('Password must be at least 8 characters');
            }
            
            if ($password !== $confirmPassword) {
                throw new Exception('Passwords do not match');
            }
            
            if (empty($name)) {
                throw new Exception('Name is required');
            }
            
            // Check if user already exists
            if ($this->userModel->findByEmail($email)) {
                throw new Exception('Email already registered');
            }
            
            // Create user
            $userId = $this->userModel->create($email, $password, $name);
            
            return [
                'success' => true,
                'message' => 'Registration successful',
                'user_id' => $userId
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    public function logout() {
        session_destroy();
        return [
            'success' => true,
            'message' => 'Logout successful'
        ];
    }
    
    public function isAuthenticated() {
        return isset($_SESSION['user_id']) && 
               isset($_SESSION['login_time']) && 
               (time() - $_SESSION['login_time']) < SESSION_TIMEOUT;
    }
}
?>
