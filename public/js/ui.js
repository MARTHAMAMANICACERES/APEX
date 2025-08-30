// UI Manager for handling user interface interactions
class UIManager {
  constructor() {
    this.loadingElements = new Set()
    this.notifications = []
  }

  // Loading states
  showLoading(element = null) {
    if (element) {
      const loadingSpinner = this.createLoadingSpinner()
      const submitBtn = element.querySelector('button[type="submit"]')

      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.innerHTML = `${loadingSpinner} Processing...`
        this.loadingElements.add(submitBtn)
      }
    } else {
      // Show global loading
      this.showGlobalLoading()
    }
  }

  hideLoading(element = null) {
    if (element) {
      const submitBtn = element.querySelector('button[type="submit"]')

      if (submitBtn && this.loadingElements.has(submitBtn)) {
        submitBtn.disabled = false
        submitBtn.innerHTML = submitBtn.dataset.originalText || "Submit"
        this.loadingElements.delete(submitBtn)
      }
    } else {
      // Hide global loading
      this.hideGlobalLoading()
    }
  }

  createLoadingSpinner() {
    return '<span class="loading"></span>'
  }

  showGlobalLoading() {
    let loader = document.getElementById("global-loader")
    if (!loader) {
      loader = document.createElement("div")
      loader.id = "global-loader"
      loader.className = "global-loader"
      loader.innerHTML = `
                <div class="loader-backdrop">
                    <div class="loader-content">
                        <div class="loading"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            `
      document.body.appendChild(loader)
    }
    loader.style.display = "flex"
  }

  hideGlobalLoading() {
    const loader = document.getElementById("global-loader")
    if (loader) {
      loader.style.display = "none"
    }
  }

  // Error handling
  showError(message, container = null) {
    const alert = this.createAlert("error", message)

    if (container) {
      const existingAlert = container.querySelector(".alert")
      if (existingAlert) {
        existingAlert.remove()
      }
      container.insertBefore(alert, container.firstChild)
    } else {
      this.showNotification("error", message)
    }
  }

  showSuccess(message, container = null) {
    const alert = this.createAlert("success", message)

    if (container) {
      const existingAlert = container.querySelector(".alert")
      if (existingAlert) {
        existingAlert.remove()
      }
      container.insertBefore(alert, container.firstChild)
    } else {
      this.showNotification("success", message)
    }
  }

  showWarning(message, container = null) {
    const alert = this.createAlert("warning", message)

    if (container) {
      const existingAlert = container.querySelector(".alert")
      if (existingAlert) {
        existingAlert.remove()
      }
      container.insertBefore(alert, container.firstChild)
    } else {
      this.showNotification("warning", message)
    }
  }

  createAlert(type, message) {
    const alert = document.createElement("div")
    alert.className = `alert alert-${type}`
    alert.innerHTML = `
            <span>${message}</span>
            <button type="button" class="alert-close" onclick="this.parentElement.remove()">×</button>
        `
    return alert
  }

  clearErrors(container) {
    const alerts = container.querySelectorAll(".alert")
    alerts.forEach((alert) => alert.remove())

    const errorInputs = container.querySelectorAll(".form-input.error")
    errorInputs.forEach((input) => {
      input.classList.remove("error")
      const errorMsg = input.parentElement.querySelector(".form-error")
      if (errorMsg) {
        errorMsg.remove()
      }
    })
  }

  // Notifications (toast-style)
  showNotification(type, message, duration = 5000) {
    const notification = this.createNotification(type, message)
    const container = this.getNotificationContainer()

    container.appendChild(notification)
    this.notifications.push(notification)

    // Auto-remove after duration
    setTimeout(() => {
      this.removeNotification(notification)
    }, duration)

    // Add click to dismiss
    notification.addEventListener("click", () => {
      this.removeNotification(notification)
    })
  }

  createNotification(type, message) {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button type="button" class="notification-close">×</button>
            </div>
        `

    // Add close button functionality
    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      this.removeNotification(notification)
    })

    return notification
  }

  getNotificationIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    }
    return icons[type] || icons.info
  }

  getNotificationContainer() {
    let container = document.getElementById("notification-container")
    if (!container) {
      container = document.createElement("div")
      container.id = "notification-container"
      container.className = "notification-container"
      document.body.appendChild(container)
    }
    return container
  }

  removeNotification(notification) {
    if (notification && notification.parentElement) {
      notification.style.opacity = "0"
      notification.style.transform = "translateX(100%)"

      setTimeout(() => {
        notification.remove()
        const index = this.notifications.indexOf(notification)
        if (index > -1) {
          this.notifications.splice(index, 1)
        }
      }, 300)
    }
  }

  // Form validation
  validateForm(form) {
    const inputs = form.querySelectorAll(".form-input[required]")
    let isValid = true

    inputs.forEach((input) => {
      if (!this.validateInput(input)) {
        isValid = false
      }
    })

    return isValid
  }

  validateInput(input) {
    const value = input.value.trim()
    const type = input.type
    let isValid = true
    let errorMessage = ""

    // Clear previous errors
    input.classList.remove("error")
    const existingError = input.parentElement.querySelector(".form-error")
    if (existingError) {
      existingError.remove()
    }

    // Required validation
    if (input.hasAttribute("required") && !value) {
      isValid = false
      errorMessage = "This field is required"
    }

    // Type-specific validation
    if (value && type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        isValid = false
        errorMessage = "Please enter a valid email address"
      }
    }

    if (value && input.name === "password" && value.length < 8) {
      isValid = false
      errorMessage = "Password must be at least 8 characters"
    }

    if (value && input.name === "confirm_password") {
      const passwordInput = input.form.querySelector('input[name="password"]')
      if (passwordInput && value !== passwordInput.value) {
        isValid = false
        errorMessage = "Passwords do not match"
      }
    }

    // Show error if invalid
    if (!isValid) {
      input.classList.add("error")
      const errorElement = document.createElement("div")
      errorElement.className = "form-error"
      errorElement.textContent = errorMessage
      input.parentElement.appendChild(errorElement)
    }

    return isValid
  }

  // Utility methods
  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
}
