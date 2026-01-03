<template>
  <div class="assignments-page">
    <div class="page-header">
      <h1>Manage Assignments</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Create Assignment
      </button>
    </div>
    
    <!-- Subject Filter -->
    <div class="subject-filter">
      <label for="subjectSelect">Filter by Subject:</label>
      <select id="subjectSelect" v-model="selectedSubject" @change="fetchAssignments">
        <option value="">All Subjects</option>
        <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
          {{ subject.name }}
        </option>
      </select>
    </div>
    
    <div v-if="loading" class="loading">Loading assignments...</div>
    
    <div v-else-if="assignments.length === 0" class="empty-state">
      <p>No assignments found. Create your first assignment!</p>
    </div>
    
    <div v-else class="assignments-list">
      <div v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
        <div class="assignment-header">
          <h3>{{ assignment.title }}</h3>
          <span :class="['status', { 'late': isPastDue(assignment.due_date) }]">
            {{ isPastDue(assignment.due_date) ? 'PAST DUE' : 'ACTIVE' }}
          </span>
        </div>
        
        <div class="assignment-info">
          <p><strong>Subject:</strong> {{ assignment.subject_name }}</p>
          <p><strong>Due Date:</strong> {{ formatDate(assignment.due_date) }}</p>
          <p><strong>Created:</strong> {{ formatDate(assignment.created_at) }}</p>
          <p><strong>Submissions:</strong> {{ assignment.submission_count || 0 }}</p>
        </div>
        
        <div class="assignment-description">
          <p>{{ assignment.description || 'No description provided.' }}</p>
        </div>
        
        <div class="assignment-actions">
          <button 
            @click="viewSubmissions(assignment.id)"
            class="btn btn-primary"
          >
            View Submissions ({{ assignment.submission_count || 0 }})
          </button>
        </div>
      </div>
    </div>
    
    <!-- Create Assignment Modal -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Create New Assignment</h2>
          <button @click="closeModal" class="modal-close">&times;</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="createAssignment">
            <div class="form-group">
              <label for="subjectSelectModal">Subject *</label>
              <select 
                id="subjectSelectModal" 
                v-model="newAssignment.subject_id" 
                required
              >
                <option value="">Select Subject</option>
                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                  {{ subject.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="assignmentTitle">Title *</label>
              <input
                type="text"
                id="assignmentTitle"
                v-model="newAssignment.title"
                required
                placeholder="Enter assignment title"
              />
            </div>
            
            <div class="form-group">
              <label for="assignmentDescription">Description</label>
              <textarea
                id="assignmentDescription"
                v-model="newAssignment.description"
                rows="4"
                placeholder="Enter assignment description"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="dueDate">Due Date *</label>
              <input
                type="datetime-local"
                id="dueDate"
                v-model="newAssignment.due_date"
                required
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
                {{ creating ? 'Creating...' : 'Create Assignment' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const assignments = ref([])
const subjects = ref([])
const loading = ref(false)
const selectedSubject = ref('')
const showCreateModal = ref(false)
const creating = ref(false)
const createError = ref('')

const newAssignment = ref({
  subject_id: '',
  title: '',
  description: '',
  due_date: ''
})

const filteredAssignments = computed(() => {
  if (!selectedSubject.value) return assignments.value
  return assignments.value.filter(a => a.subject_id == selectedSubject.value)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const isPastDue = (dueDate) => {
  return new Date(dueDate) < new Date()
}

const fetchSubjects = async () => {
  try {
    const response = await authStore.api.get('/api/subjects')
    subjects.value = response.data
  } catch (error) {
    console.error('Error fetching subjects:', error)
  }
}

const fetchAssignments = async () => {
  loading.value = true
  try {
    if (selectedSubject.value) {
      const response = await authStore.api.get(`/api/assignments/${selectedSubject.value}`)
      assignments.value = response.data
    } else {
      // Fetch all assignments by getting assignments for each subject
      assignments.value = []
      for (const subject of subjects.value) {
        const response = await authStore.api.get(`/api/assignments/${subject.id}`)
        assignments.value.push(...response.data)
      }
    }
  } catch (error) {
    console.error('Error fetching assignments:', error)
  } finally {
    loading.value = false
  }
}

const createAssignment = async () => {
  creating.value = true
  createError.value = ''
  
  try {
    const formData = new FormData()
    formData.append('subject_id', newAssignment.value.subject_id)
    formData.append('title', newAssignment.value.title)
    formData.append('description', newAssignment.value.description)
    formData.append('due_date', newAssignment.value.due_date)
    
    const response = await authStore.api.post('/api/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    assignments.value.push(response.data.assignment)
    closeModal()
    resetForm()
  } catch (error) {
    createError.value = error.response?.data?.message || 'Failed to create assignment'
  } finally {
    creating.value = false
  }
}

const viewSubmissions = (assignmentId) => {
  // In a real app, this would navigate to a submissions page
  alert(`Viewing submissions for assignment ${assignmentId}. This would navigate to submissions page.`)
}

const closeModal = () => {
  showCreateModal.value = false
  resetForm()
}

const resetForm = () => {
  newAssignment.value = {
    subject_id: '',
    title: '',
    description: '',
    due_date: ''
  }
  createError.value = ''
}

onMounted(async () => {
  await fetchSubjects()
  await fetchAssignments()
})
</script>

<style scoped>
.subject-filter {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.subject-filter label {
  font-weight: 500;
}

.subject-filter select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  min-width: 200px;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assignment-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--primary-color);
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.assignment-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: #10b981;
  color: white;
}

.status.late {
  background-color: var(--danger-color);
}

.assignment-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.assignment-info p {
  margin: 0;
  color: var(--text-secondary);
}

.assignment-description {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.assignment-description p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
</style>