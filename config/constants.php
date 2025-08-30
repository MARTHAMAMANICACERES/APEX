<?php
// Application constants
define('APP_NAME', 'PagoMicros');
define('APP_VERSION', '1.0.0');
define('BASE_URL', 'http://localhost/pago-micros');

// Payment constants
define('MIN_PAYMENT_AMOUNT', 0.01);
define('MAX_PAYMENT_AMOUNT', 1000.00);
define('TOKEN_EXPIRY_MINUTES', 30);

// Security constants
define('BCRYPT_COST', 12);
define('SESSION_TIMEOUT', 3600); // 1 hour

// API endpoints
define('API_BASE_URL', BASE_URL . '/api');

// File paths
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('LOG_PATH', __DIR__ . '/../logs/');
?>
