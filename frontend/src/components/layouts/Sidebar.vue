<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <button @click="toggleSidebar" class="sidebar-toggle">
        {{ isCollapsed ? '▶' : '◀' }}
      </button>
      <h3 v-if="!isCollapsed">Navigation</h3>
    </div>
    
    <nav class="sidebar-nav">
      <div v-for="group in navGroups" :key="group.title" class="nav-group">
        <h4 v-if="!isCollapsed" class="nav-group-title">{{ group.title }}</h4>
        <div class="nav-items">
          <router-link
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            :class="{ 'active': $route.path === item.to || $route.path.startsWith(item.to + '/') }"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()
const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const teacherNavItems = computed(() => [
  {
    title: 'Teaching',
    items: [
      { to: '/teacher/dashboard', label: 'Dashboard', icon: '📊' },
      { to: '/teacher/subjects', label: 'Subjects', icon: '📚' },
      { to: '/teacher/assignments', label: 'Assignments', icon: '📝' },
      { to: '/teacher/attendance', label: 'Attendance', icon: '👥' }
    ]
  }
])

const studentNavItems = computed(() => [
  {
    title: 'Learning',
    items: [
      { to: '/student/dashboard', label: 'Dashboard', icon: '📊' },
      { to: '/student/assignments', label: 'Assignments', icon: '📝' },
      { to: '/student/attendance', label: 'Attendance', icon: '📅' },
      { to: '/student/submissions', label: 'My Submissions', icon: '📤' }
    ]
  }
])

const navGroups = computed(() => {
  if (!authStore.isAuthenticated) return []
  return authStore.user.role === 'teacher' ? teacherNavItems.value : studentNavItems.value
})
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  height: calc(100vh - 70px);
  position: fixed;
  left: 0;
  top: 70px;
  transition: width 0.3s;
  overflow-y: auto;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.sidebar-toggle {
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-group {
  margin-bottom: 1.5rem;
}

.nav-group-title {
  padding: 0 1rem 0.5rem 1rem;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.nav-items {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: #f9fafb;
  color: var(--primary-color);
}

.nav-item.active {
  background-color: #eef2ff;
  color: var(--primary-color);
  border-left-color: var(--primary-color);
  font-weight: 500;
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.nav-label {
  font-size: 0.875rem;
}

.sidebar.collapsed .nav-label,
.sidebar.collapsed .nav-group-title {
  display: none;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 0.75rem;
}
</style>