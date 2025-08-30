<?php
require_once __DIR__ . '/../utils/Database.php';

class Token {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function create($microId, $amount, $description = null) {
        $token = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+' . TOKEN_EXPIRY_MINUTES . ' minutes'));
        
        $sql = "INSERT INTO tokens (token, micro_id, amount, description, expires_at, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())";
        
        $this->db->query($sql, [$token, $microId, $amount, $description, $expiresAt]);
        
        return $token;
    }
    
    public function findByToken($token) {
        $sql = "SELECT t.*, m.name as micro_name, m.description as micro_description 
                FROM tokens t 
                JOIN micros m ON t.micro_id = m.id 
                WHERE t.token = ? AND t.expires_at > NOW() AND t.used = 0";
        
        $stmt = $this->db->query($sql, [$token]);
        return $stmt->fetch();
    }
    
    public function markAsUsed($token, $transactionId) {
        $sql = "UPDATE tokens SET used = 1, transaction_id = ?, used_at = NOW() WHERE token = ?";
        return $this->db->query($sql, [$transactionId, $token]);
    }
    
    public function isValid($token) {
        $tokenData = $this->findByToken($token);
        return $tokenData !== false;
    }
    
    public function cleanExpired() {
        $sql = "DELETE FROM tokens WHERE expires_at < NOW() AND used = 0";
        return $this->db->query($sql);
    }
}
?>
