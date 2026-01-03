<template>
  <div class="default-layout">
    <nav class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <router-link to="/" class="logo">ClassFlow</router-link>
        </div>
        <div class="navbar-menu">
          <div v-if="authStore.isAuthenticated" class="navbar-items">
            <router-link 
              v-for="item in navItems" 
              :key="item.to" 
              :to="item.to"
              class="nav-item"
            >
              {{ item.label }}
            </router-link>
            <button @click="logout" class="btn btn-danger">Logout</button>
            <span class="user-info">{{ authStore.user.email }} ({{ authStore.user.role }})</span>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

const navItems = computed(() => {
  if (authStore.user?.role === 'teacher') {
    return [
      { to: '/teacher/dashboard', label: 'Dashboard' },
      { to: '/teacher/subjects', label: 'Subjects' },
      { to: '/teacher/assignments', label: 'Assignments' },
      { to: '/teacher/attendance', label: 'Attendance' }
    ]
  } else if (authStore.user?.role === 'student') {
    return [
      { to: '/student/dashboard', label: 'Dashboard' },
      { to: '/student/assignments', label: 'Assignments' },
      { to: '/student/attendance', label: 'Attendance' },
      { to: '/student/submissions', label: 'My Submissions' }
    ]
  }
  return []
})

const logout = () => {
  authStore.logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
}

.navbar {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-items {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-item {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.nav-item:hover {
  color: var(--primary-color);
  background-color: #f3f4f6;
}

.nav-item.router-link-active {
  color: var(--primary-color);
  font-weight: 600;
}

.user-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
  padding: 0.25rem 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
}

.main-content {
  padding: 2rem 0;
}
</style>