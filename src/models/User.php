<?php
require_once __DIR__ . '/../utils/Database.php';
require_once __DIR__ . '/../utils/Security.php';

class User {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function create($email, $password, $name) {
        $hashedPassword = Security::hashPassword($password);
        
        $sql = "INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, NOW())";
        $stmt = $this->db->query($sql, [$email, $hashedPassword, $name]);
        
        return $this->db->lastInsertId();
    }
    
    public function findByEmail($email) {
        $sql = "SELECT * FROM users WHERE email = ? AND active = 1";
        $stmt = $this->db->query($sql, [$email]);
        return $stmt->fetch();
    }
    
    public function findById($id) {
        $sql = "SELECT * FROM users WHERE id = ? AND active = 1";
        $stmt = $this->db->query($sql, [$id]);
        return $stmt->fetch();
    }
    
    public function authenticate($email, $password) {
        $user = $this->findByEmail($email);
        
        if ($user && Security::verifyPassword($password, $user['password'])) {
            // Update last login
            $this->updateLastLogin($user['id']);
            return $user;
        }
        
        return false;
    }
    
    public function updateLastLogin($userId) {
        $sql = "UPDATE users SET last_login = NOW() WHERE id = ?";
        $this->db->query($sql, [$userId]);
    }
    
    public function updateProfile($userId, $name, $phone = null) {
        $sql = "UPDATE users SET name = ?, phone = ?, updated_at = NOW() WHERE id = ?";
        return $this->db->query($sql, [$name, $phone, $userId]);
    }
    
    public function changePassword($userId, $newPassword) {
        $hashedPassword = Security::hashPassword($newPassword);
        $sql = "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?";
        return $this->db->query($sql, [$hashedPassword, $userId]);
    }
}
?>
