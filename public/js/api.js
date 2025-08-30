// API Client for handling all server communications
class ApiClient {
  constructor() {
    this.baseUrl = "/pago-micros/api"
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin)
    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key])
    })

    return this.request(url.pathname + url.search, {
      method: "GET",
    })
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    })
  }

  // Authentication endpoints
  async login(email, password) {
    return this.post("/auth.php", {
      action: "login",
      email,
      password,
    })
  }

  async register(email, password, name, confirmPassword) {
    return this.post("/auth.php", {
      action: "register",
      email,
      password,
      name,
      confirm_password: confirmPassword,
    })
  }

  async logout() {
    return this.post("/auth.php", {
      action: "logout",
    })
  }

  // Token endpoints
  async validateToken(token) {
    return this.post("/token.php", {
      action: "validate",
      token,
    })
  }

  async generateToken(microId, amount, description = "") {
    return this.post("/token.php", {
      action: "generate",
      micro_id: microId,
      amount,
      description,
    })
  }

  // Payment endpoints
  async processPayment(paymentData) {
    return this.post("/payment.php", {
      action: "process",
      ...paymentData,
    })
  }

  async getPaymentMethods() {
    return this.get("/payment.php?action=methods")
  }

  async getTransactionHistory(limit = 10) {
    return this.get("/payment.php", {
      action: "history",
      limit,
    })
  }

  async getTransactionDetails(transactionId) {
    return this.get("/payment.php", {
      action: "details",
      transaction_id: transactionId,
    })
  }

  // User endpoints
  async getUserProfile() {
    return this.get("/auth.php?action=profile")
  }

  async updateProfile(profileData) {
    return this.put("/auth.php", {
      action: "update_profile",
      ...profileData,
    })
  }

  async changePassword(currentPassword, newPassword) {
    return this.post("/auth.php", {
      action: "change_password",
      current_password: currentPassword,
      new_password: newPassword,
    })
  }

  // Notification endpoints
  async getNotifications() {
    return this.get("/notification.php")
  }

  async markNotificationRead(notificationId) {
    return this.post("/notification.php", {
      action: "mark_read",
      notification_id: notificationId,
    })
  }
}
