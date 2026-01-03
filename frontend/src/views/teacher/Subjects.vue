<template>
  <div class="subjects-page">
    <div class="page-header">
      <h1>Manage Subjects</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Create New Subject
      </button>
    </div>
    
    <div v-if="loading" class="loading">Loading subjects...</div>
    
    <div v-else-if="subjects.length === 0" class="empty-state">
      <p>No subjects created yet. Create your first subject!</p>
    </div>
    
    <div v-else class="subjects-grid">
      <div v-for="subject in subjects" :key="subject.id" class="subject-card">
        <div class="subject-header">
          <h3>{{ subject.name }}</h3>
          <span class="subject-id">ID: {{ subject.id }}</span>
        </div>
        
        <div class="subject-info">
          <p><strong>Teacher:</strong> {{ subject.teacher_email }}</p>
          <p><strong>Created:</strong> {{ formatDate(subject.created_at) }}</p>
          <p><strong>Assignments:</strong> {{ subject.assignment_count || 0 }}</p>
        </div>
        
        <div class="subject-actions">
          <router-link 
            :to="`/teacher/assignments?subject=${subject.id}`"
            class="btn btn-primary"
          >
            View Assignments
          </router-link>
          <router-link 
            :to="`/teacher/attendance?subject=${subject.id}`"
            class="btn btn-secondary"
          >
            Mark Attendance
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Create Subject Modal -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Create New Subject</h2>
          <button @click="closeModal" class="modal-close">&times;</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="createSubject">
            <div class="form-group">
              <label for="subjectName">Subject Name</label>
              <input
                type="text"
                id="subjectName"
                v-model="newSubject.name"
                required
                placeholder="Enter subject name"
              />
            </div>
            
            <div v-if="createError" class="error-message">
              {{ createError }}
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="creating">
                {{ creating ? 'Creating...' : 'Create Subject' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()
const subjects = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const creating = ref(false)
const createError = ref('')

const newSubject = ref({
  name: ''
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchSubjects = async () => {
  loading.value = true
  try {
    const response = await authStore.api.get('/api/subjects')
    subjects.value = response.data
  } catch (error) {
    console.error('Error fetching subjects:', error)
  } finally {
    loading.value = false
  }
}

const createSubject = async () => {
  creating.value = true
  createError.value = ''
  
  try {
    const response = await authStore.api.post('/api/subjects', newSubject.value)
    
    subjects.value.push(response.data.subject)
    closeModal()
    newSubject.value.name = ''
  } catch (error) {
    createError.value = error.response?.data?.message || 'Failed to create subject'
  } finally {
    creating.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  newSubject.value.name = ''
  createError.value = ''
}

onMounted(() => {
  fetchSubjects()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.subject-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.subject-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.subject-header h3 {
  margin: 0;
  color: var(--primary-color);
}

.subject-id {
  font-size: 0.875rem;
  color: var(--text-secondary);
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.subject-info {
  margin-bottom: 1.5rem;
}

.subject-info p {
  margin: 0.5rem 0;
  color: var(--text-secondary);
}

.subject-actions {
  display: flex;
  gap: 0.5rem;
}

.subject-actions .btn {
  flex: 1;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.75rem;
  color: var(--text-secondary);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
</style>