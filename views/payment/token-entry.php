<?php
session_start();
require_once '../../config/constants.php';

// Check authentication
if (!isset($_SESSION['user_id'])) {
    header('Location: ../auth/login.php');
    exit();
}

include '../partials/header.php';
?>

<div class="container">
    <div class="payment-container">
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Enter Payment Token</h2>
            </div>
            <div class="card-body">
                <p class="text-center mb-4">
                    Enter the 8-character token provided by the merchant to proceed with your payment.
                </p>
                
                <div class="form-group">
                    <label for="token" class="form-label">Payment Token</label>
                    <input 
                        type="text" 
                        id="token" 
                        name="token" 
                        class="form-input token-input" 
                        placeholder="Enter 8-character token"
                        maxlength="8"
                        style="text-transform: uppercase; text-align: center; font-size: 1.5rem; letter-spacing: 0.2em;"
                    >
                </div>
                
                <div id="token-info" class="hidden mt-4"></div>
            </div>
        </div>
        
        <div class="text-center mt-4">
            <p class="text-sm text-secondary">
                Need help? Contact the merchant for your payment token.
            </p>
        </div>
    </div>
</div>

<?php include '../partials/footer.php'; ?>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const tokenInput = document.getElementById('token');
    
    tokenInput.addEventListener('input', function(e) {
        // Auto-uppercase and limit to 8 characters
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8);
    });
});
</script>
