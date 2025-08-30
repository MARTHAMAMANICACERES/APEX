<?php
require_once __DIR__ . '/../utils/Database.php';

class Transaction {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function create($userId, $tokenId, $amount, $paymentMethod, $description = null) {
        $transactionId = 'TXN_' . strtoupper(uniqid());
        
        $sql = "INSERT INTO transactions (transaction_id, user_id, token_id, amount, payment_method, description, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())";
        
        $this->db->query($sql, [$transactionId, $userId, $tokenId, $amount, $paymentMethod, $description]);
        
        return $transactionId;
    }
    
    public function updateStatus($transactionId, $status, $paymentReference = null) {
        $sql = "UPDATE transactions SET status = ?, payment_reference = ?, updated_at = NOW() WHERE transaction_id = ?";
        return $this->db->query($sql, [$status, $paymentReference, $transactionId]);
    }
    
    public function findByTransactionId($transactionId) {
        $sql = "SELECT t.*, u.name as user_name, u.email as user_email 
                FROM transactions t 
                JOIN users u ON t.user_id = u.id 
                WHERE t.transaction_id = ?";
        
        $stmt = $this->db->query($sql, [$transactionId]);
        return $stmt->fetch();
    }
    
    public function findByUserId($userId, $limit = 10) {
        $sql = "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?";
        $stmt = $this->db->query($sql, [$userId, $limit]);
        return $stmt->fetchAll();
    }
    
    public function getStats($userId = null) {
        if ($userId) {
            $sql = "SELECT 
                        COUNT(*) as total_transactions,
                        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_amount,
                        COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_transactions
                    FROM transactions WHERE user_id = ?";
            $stmt = $this->db->query($sql, [$userId]);
        } else {
            $sql = "SELECT 
                        COUNT(*) as total_transactions,
                        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_amount,
                        COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_transactions
                    FROM transactions";
            $stmt = $this->db->query($sql);
        }
        
        return $stmt->fetch();
    }
}
?>
