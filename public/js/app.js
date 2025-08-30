// Main application JavaScript
const ApiClient = require("./ApiClient") // Declare ApiClient
const UIManager = require("./UIManager") // Declare UIManager

class PagoMicrosApp {
  constructor() {
    this.api = new ApiClient()
    this.ui = new UIManager()
    this.currentUser = null
    this.currentToken = null

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.checkAuthStatus()
    this.loadUserData()
  }

  setupEventListeners() {
    // Global event listeners
    document.addEventListener("DOMContentLoaded", () => {
      this.ui.hideLoading()
    })

    // Form submissions
    document.addEventListener("submit", (e) => {
      if (e.target.matches(".auth-form")) {
        e.preventDefault()
        this.handleAuthForm(e.target)
      }

      if (e.target.matches(".payment-form")) {
        e.preventDefault()
        this.handlePaymentForm(e.target)
      }
    })

    // Button clicks
    document.addEventListener("click", (e) => {
      if (e.target.matches(".logout-btn")) {
        e.preventDefault()
        this.handleLogout()
      }

      if (e.target.matches(".payment-method")) {
        this.selectPaymentMethod(e.target)
      }
    })

    // Input changes
    document.addEventListener("input", (e) => {
      if (e.target.matches(".token-input")) {
        this.handleTokenInput(e.target)
      }
    })
  }

  async handleAuthForm(form) {
    const formData = new FormData(form)
    const action = form.dataset.action

    this.ui.showLoading(form)
    this.ui.clearErrors(form)

    try {
      let result

      if (action === "login") {
        result = await this.api.login(formData.get("email"), formData.get("password"))
      } else if (action === "register") {
        result = await this.api.register(
          formData.get("email"),
          formData.get("password"),
          formData.get("name"),
          formData.get("confirm_password"),
        )
      }

      if (result.success) {
        this.ui.showSuccess(result.message)

        if (action === "login") {
          this.currentUser = result.user
          setTimeout(() => {
            window.location.href = "index.php"
          }, 1000)
        } else {
          setTimeout(() => {
            window.location.href = "login.php"
          }, 1000)
        }
      } else {
        this.ui.showError(result.message, form)
      }
    } catch (error) {
      this.ui.showError("An error occurred. Please try again.", form)
      console.error("Auth error:", error)
    } finally {
      this.ui.hideLoading(form)
    }
  }

  async handleTokenInput(input) {
    const token = input.value.trim().toUpperCase()

    if (token.length === 8) {
      this.ui.showLoading()

      try {
        const result = await this.api.validateToken(token)

        if (result.success) {
          this.currentToken = result.token
          this.displayTokenInfo(result.token)
        } else {
          this.ui.showError(result.message)
          this.clearTokenInfo()
        }
      } catch (error) {
        this.ui.showError("Error validating token")
        console.error("Token validation error:", error)
      } finally {
        this.ui.hideLoading()
      }
    } else {
      this.clearTokenInfo()
    }
  }

  displayTokenInfo(tokenData) {
    const container = document.getElementById("token-info")
    if (container) {
      container.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title">${tokenData.micro_name}</h3>
                        <p class="amount-display">$${Number.parseFloat(tokenData.amount).toFixed(2)}</p>
                        <p>${tokenData.description || tokenData.micro_description}</p>
                        <button type="button" class="btn btn-primary btn-full" onclick="app.proceedToPayment()">
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            `
      container.classList.remove("hidden")
    }
  }

  clearTokenInfo() {
    const container = document.getElementById("token-info")
    if (container) {
      container.innerHTML = ""
      container.classList.add("hidden")
    }
    this.currentToken = null
  }

  proceedToPayment() {
    if (this.currentToken) {
      sessionStorage.setItem("currentToken", JSON.stringify(this.currentToken))
      window.location.href = "payment-options.php"
    }
  }

  selectPaymentMethod(element) {
    // Remove selection from all methods
    document.querySelectorAll(".payment-method").forEach((method) => {
      method.classList.remove("selected")
    })

    // Select clicked method
    element.classList.add("selected")

    // Enable continue button
    const continueBtn = document.getElementById("continue-payment")
    if (continueBtn) {
      continueBtn.disabled = false
    }
  }

  async handlePaymentForm(form) {
    const formData = new FormData(form)
    const selectedMethod = document.querySelector(".payment-method.selected")

    if (!selectedMethod) {
      this.ui.showError("Please select a payment method")
      return
    }

    const paymentMethod = selectedMethod.dataset.method
    const tokenData = JSON.parse(sessionStorage.getItem("currentToken") || "{}")

    this.ui.showLoading(form)

    try {
      const result = await this.api.processPayment({
        token: tokenData.token,
        payment_method: paymentMethod,
        amount: tokenData.amount,
      })

      if (result.success) {
        sessionStorage.setItem("transactionResult", JSON.stringify(result))
        window.location.href = "receipt.php"
      } else {
        this.ui.showError(result.message, form)
      }
    } catch (error) {
      this.ui.showError("Payment processing failed. Please try again.", form)
      console.error("Payment error:", error)
    } finally {
      this.ui.hideLoading(form)
    }
  }

  async handleLogout() {
    try {
      await this.api.logout()
      this.currentUser = null
      window.location.href = "views/auth/login.php"
    } catch (error) {
      console.error("Logout error:", error)
      // Force logout even if API call fails
      window.location.href = "views/auth/login.php"
    }
  }

  checkAuthStatus() {
    // Check if user session is still valid
    const loginTime = sessionStorage.getItem("loginTime")
    if (loginTime) {
      const elapsed = Date.now() - Number.parseInt(loginTime)
      if (elapsed > 3600000) {
        // 1 hour
        this.handleLogout()
      }
    }
  }

  loadUserData() {
    // Load user data from session or API
    const userData = sessionStorage.getItem("userData")
    if (userData) {
      this.currentUser = JSON.parse(userData)
      this.updateUserInterface()
    }
  }

  updateUserInterface() {
    if (this.currentUser) {
      const userNameElements = document.querySelectorAll(".user-name")
      userNameElements.forEach((element) => {
        element.textContent = this.currentUser.name
      })

      const userEmailElements = document.querySelectorAll(".user-email")
      userEmailElements.forEach((element) => {
        element.textContent = this.currentUser.email
      })
    }
  }
}

// Initialize app when DOM is loaded
let app
document.addEventListener("DOMContentLoaded", () => {
  app = new PagoMicrosApp()
})
