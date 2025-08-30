<?php
class DatabaseConfig {
    private const HOST = 'localhost';
    private const DB_NAME = 'pago_micros';
    private const USERNAME = 'root';
    private const PASSWORD = '';
    
    public static function getConnection() {
        try {
            $pdo = new PDO(
                "mysql:host=" . self::HOST . ";dbname=" . self::DB_NAME . ";charset=utf8mb4",
                self::USERNAME,
                self::PASSWORD,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
            return $pdo;
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }
}
?>
