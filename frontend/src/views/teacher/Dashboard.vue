<template>
  <div class="dashboard">
    <h1>Teacher Dashboard</h1>
    
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <h3>{{ subjects.length }}</h3>
          <p>Subjects</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-content">
          <h3>{{ totalAssignments }}</h3>
          <p>Assignments</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ totalStudents }}</h3>
          <p>Students</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-sections">
      <div class="section">
        <h2>Recent Subjects</h2>
        <div v-if="subjects.length > 0" class="subject-list">
          <div v-for="subject in recentSubjects" :key="subject.id" class="subject-card">
            <h3>{{ subject.name }}</h3>
            <p>Created: {{ formatDate(subject.created_at) }}</p>
            <router-link 
              :to="`/teacher/assignments?subject=${subject.id}`" 
              class="btn btn-primary"
            >
              View Assignments
            </router-link>
          </div>
        </div>
        <p v-else>No subjects yet. Create your first subject!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()
const subjects = ref([])
const totalStudents = ref(0)

const totalAssignments = computed(() => {
  return subjects.value.reduce((total, subject) => total + subject.assignment_count, 0)
})

const recentSubjects = computed(() => {
  return [...subjects.value]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const fetchData = async () => {
  try {
    // Fetch subjects
    const subjectsResponse = await authStore.api.get('/api/subjects')
    subjects.value = subjectsResponse.data
    
    // Fetch students count
    const studentsResponse = await authStore.api.get('/api/students')
    totalStudents.value = studentsResponse.data.length
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dashboard h1 {
  margin-bottom: 2rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
}

.stat-content h3 {
  font-size: 1.875rem;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0;
}

.stat-content p {
  color: var(--text-secondary);
  margin: 0;
}

.dashboard-sections {
  display: grid;
  gap: 2rem;
}

.section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.subject-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.subject-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s;
}

.subject-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.1);
}

.subject-card h3 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.subject-card p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
</style>