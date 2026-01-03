import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')))
  const token = ref(localStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value)

  const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Add token to requests if available
  api.interceptors.request.use(config => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  async function register(email, password, role) {
    try {
      const response = await api.post('/register', {
        email,
        password,
        role
      })
      
      token.value = response.data.token
      user.value = response.data.user
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  async function login(email, password) {
    try {
      const response = await api.post('/login', {
        email,
        password
      })
      
      token.value = response.data.token
      user.value = response.data.user
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function getCurrentUser() {
    try {
      const response = await api.get('/me')
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(user.value))
      return { success: true, data: response.data }
    } catch (error) {
      logout()
      return { success: false, error: error.response?.data?.message }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    api,
    register,
    login,
    logout,
    getCurrentUser
  }
})