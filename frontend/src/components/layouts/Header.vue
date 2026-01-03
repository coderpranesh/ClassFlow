<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text">ClassFlow</span>
        </router-link>
        
        <nav class="nav">
          <router-link 
            v-for="item in navItems" 
            :key="item.to" 
            :to="item.to"
            class="nav-link"
            :class="{ 'active': $route.path.startsWith(item.to) }"
          >
            {{ item.label }}
          </router-link>
        </nav>
        
        <div class="user-menu" v-if="authStore.isAuthenticated">
          <div class="user-info">
            <span class="user-email">{{ authStore.user.email }}</span>
            <span class="user-role">{{ authStore.user.role }}</span>
          </div>
          <button @click="logout" class="btn btn-logout">
            <span class="logout-icon">🚪</span>
            Logout
          </button>
        </div>
        
        <div class="auth-links" v-else>
          <router-link to="/auth/login" class="btn btn-login">Login</router-link>
          <router-link to="/auth/register" class="btn btn-register">Register</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const navItems = computed(() => {
  if (!authStore.isAuthenticated) return []
  
  if (authStore.user.role === 'teacher') {
    return [
      { to: '/teacher/dashboard', label: 'Dashboard' },
      { to: '/teacher/subjects', label: 'Subjects' },
      { to: '/teacher/assignments', label: 'Assignments' },
      { to: '/teacher/attendance', label: 'Attendance' }
    ]
  } else if (authStore.user.role === 'student') {
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
.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.logo-icon {
  font-size: 1.8rem;
}

.logo-text {
  background: linear-gradient(135deg, var(--primary-color), #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav {
  display: flex;
  gap: 1.5rem;
  margin-left: 2rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--primary-color);
  background-color: #f3f4f6;
}

.nav-link.active {
  color: var(--primary-color);
  background-color: #eef2ff;
  font-weight: 600;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-email {
  font-weight: 500;
  color: var(--text-primary);
}

.user-role {
  font-size: 0.875rem;
  color: var(--text-secondary);
  background-color: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background-color: #fecaca;
}

.logout-icon {
  font-size: 1rem;
}

.auth-links {
  display: flex;
  gap: 0.5rem;
}

.btn-login {
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
}

.btn-register {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
}
</style>