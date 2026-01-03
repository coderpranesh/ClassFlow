import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const showToast = (title, message, type = 'info', duration = 5000) => {
    const id = toastId++
    const toast = { id, title, message, type }
    
    toasts.value.push(toast)
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearToasts = () => {
    toasts.value = []
  }

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '💡'
    }
  }

  // Helper methods for common toast types
  const success = (title, message, duration) => 
    showToast(title, message, 'success', duration)
  
  const error = (title, message, duration) => 
    showToast(title, message, 'error', duration)
  
  const warning = (title, message, duration) => 
    showToast(title, message, 'warning', duration)
  
  const info = (title, message, duration) => 
    showToast(title, message, 'info', duration)

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts,
    getToastIcon,
    success,
    error,
    warning,
    info
  }
}