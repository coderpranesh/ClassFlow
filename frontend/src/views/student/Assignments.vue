<template>
  <div class="assignments-page">
    <h1>Assignments</h1>
    
    <div v-if="loading" class="loading">Loading assignments...</div>
    
    <div v-else class="assignments-container">
      <div v-for="subject in subjects" :key="subject.id" class="subject-section">
        <h2>{{ subject.name }}</h2>
        
        <div v-if="getSubjectAssignments(subject.id).length === 0" class="no-assignments">
          <p>No assignments for this subject.</p>
        </div>
        
        <div v-else class="assignments-grid">
          <div v-for="assignment in getSubjectAssignments(subject.id)" 
               :key="assignment.id" 
               class="assignment-card">
            <div class="assignment-header">
              <h3>{{ assignment.title }}</h3>
              <span :class="['status', { 
                'submitted': assignment.submitted,
                'late': assignment.is_late,
                'past-due': isPastDue(assignment.due_date) && !assignment.submitted 
              }]">
                {{ getStatusText(assignment) }}
              </span>
            </div>
            
            <div class="assignment-info">
              <p><strong>Due Date:</strong> {{ formatDate(assignment.due_date) }}</p>
              <p><strong>Created:</strong> {{ formatDate(assignment.created_at) }}</p>
              <p v-if="assignment.submitted">
                <strong>Submitted:</strong> {{ formatDate(assignment.my_submission.submitted_at) }}
              </p>
              <p v-if="assignment.my_submission?.grade">
                <strong>Grade:</strong> {{ assignment.my_submission.grade }}
              </p>
            </div>
            
            <div class="assignment-description">
              <p>{{ assignment.description || 'No description provided.' }}</p>
            </div>
            
            <div class="assignment-actions">
              <button 
                v-if="!assignment.submitted"
                @click="openSubmitModal(assignment)"
                class="btn btn-primary"
              >
                Submit Assignment
              </button>
              <button 
                v-else
                @click="downloadSubmission(assignment.my_submission.id)"
                class="btn btn-secondary"
              >
                Download Submission
              </button>
              <button 
                v-if="assignment.submitted && assignment.my_submission?.feedback"
                @click="showFeedback(assignment.my_submission)"
                class="btn"
              >
                View Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Submit Assignment Modal -->
    <div v-if="showSubmitModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Submit Assignment</h2>
          <button @click="closeModal" class="modal-close">&times;</button>
        </div>
        
        <div class="modal-body">
          <div v-if="selectedAssignment" class="assignment-details">
            <h3>{{ selectedAssignment.title }}</h3>
            <p><strong>Subject:</strong> {{ selectedAssignment.subject_name }}</p>
            <p><strong>Due Date:</strong> {{ formatDate(selectedAssignment.due_date) }}</p>
            <p v-if="isPastDue(selectedAssignment.due_date)" class="late-warning">
              ⚠️ This assignment is past due
            </p>
          </div>
          
          <form @submit.prevent="submitAssignment" class="submit-form">
            <div class="form-group">
              <label for="assignmentFile">Upload File *</label>
              <input
                type="file"
                id="assignmentFile"
                ref="fileInput"
                @change="handleFileSelect"
                required
                accept=".pdf,.doc,.docx,.txt,.zip"
              />
              <p class="file-info">
                Allowed file types: PDF, DOC, DOCX, TXT, ZIP (Max 16MB)
              </p>
              <p v-if="selectedFile" class="selected-file">
                Selected: {{ selectedFile.name }} ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB)
              </p>
            </div>
            
            <div v-if="submitError" class="error-message">
              {{ submitError }}
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                {{ submitting ? 'Submitting...' : 'Submit Assignment' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Feedback Modal -->
    <div v-if="showFeedbackModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Feedback</h2>
          <button @click="closeFeedbackModal" class="modal-close">&times;</button>
        </div>
        
        <div class="modal-body">
          <div v-if="selectedSubmission" class="feedback-content">
            <div class="grade-display">
              <h3>Grade: {{ selectedSubmission.grade || 'Not graded' }}</h3>
            </div>
            
            <div class="feedback-text">
              <h4>Feedback:</h4>
              <p>{{ selectedSubmission.feedback || 'No feedback provided.' }}</p>
            </div>
            
            <div class="submission-details">
              <p><strong>Submitted:</strong> {{ formatDate(selectedSubmission.submitted_at) }}</p>
              <p v-if="selectedSubmission.is_late" class="late">⚠️ Submitted late</p>
            </div>
          </div>
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
const assignments = ref([])
const loading = ref(false)

const showSubmitModal = ref(false)
const showFeedbackModal = ref(false)
const selectedAssignment = ref(null)
const selectedSubmission = ref(null)
const selectedFile = ref(null)
const submitting = ref(false)
const submitError = ref('')
const fileInput = ref(null)

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

const getSubjectAssignments = (subjectId) => {
  return assignments.value.filter(a => a.subject_id === subjectId)
}

const getStatusText = (assignment) => {
  if (assignment.submitted) {
    return assignment.is_late ? 'SUBMITTED (LATE)' : 'SUBMITTED'
  } else if (isPastDue(assignment.due_date)) {
    return 'PAST DUE'
  } else {
    return 'PENDING'
  }
}

const openSubmitModal = (assignment) => {
  selectedAssignment.value = assignment
  selectedFile.value = null
  submitError.value = ''
  showSubmitModal.value = true
}

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0]
}

const submitAssignment = async () => {
  if (!selectedFile.value) {
    submitError.value = 'Please select a file'
    return
  }

  submitting.value = true
  submitError.value = ''

  try {
    const formData = new FormData()
    formData.append('assignment_id', selectedAssignment.value.id)
    formData.append('file', selectedFile.value)

    const response = await authStore.api.post('/api/submissions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Update the assignment status
    const assignmentIndex = assignments.value.findIndex(a => a.id === selectedAssignment.value.id)
    if (assignmentIndex !== -1) {
      assignments.value[assignmentIndex].submitted = true
      assignments.value[assignmentIndex].my_submission = response.data.submission
    }

    closeModal()
  } catch (error) {
    submitError.value = error.response?.data?.message || 'Failed to submit assignment'
  } finally {
    submitting.value = false
  }
}

const downloadSubmission = async (submissionId) => {
  try {
    const response = await authStore.api.get(`/api/download/${submissionId}`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    
    // Extract filename from response headers
    const contentDisposition = response.headers['content-disposition']
    let filename = 'submission'
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch.length === 2) {
        filename = filenameMatch[1]
      }
    }
    
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    alert('Failed to download file: ' + error.response?.data?.message)
  }
}

const showFeedback = (submission) => {
  selectedSubmission.value = submission
  showFeedbackModal.value = true
}

const closeModal = () => {
  showSubmitModal.value = false
  selectedAssignment.value = null
  selectedFile.value = null
  submitError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const closeFeedbackModal = () => {
  showFeedbackModal.value = false
  selectedSubmission.value = null
}

const fetchData = async () => {
  loading.value = true
  try {
    // Fetch subjects
    const subjectsResponse = await authStore.api.get('/api/subjects')
    subjects.value = subjectsResponse.data

    // For each subject, fetch assignments
    for (const subject of subjects.value) {
      const assignmentsResponse = await authStore.api.get(`/api/assignments/${subject.id}`)
      assignments.value.push(...assignmentsResponse.data)
    }
  } catch (error) {
    console.error('Error fetching assignments:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.assignments-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.subject-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.subject-section h2 {
  margin-bottom: 1rem;
  color: var(--primary-color);
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.no-assignments {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.assignments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

.assignment-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.25rem;
  transition: all 0.2s;
}

.assignment-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.1);
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.assignment-header h3 {
  margin: 0;
  flex: 1;
}

.status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  white-space: nowrap;
}

.status.submitted {
  background-color: #10b981;
  color: white;
}

.status.late {
  background-color: #f59e0b;
  color: white;
}

.status.past-due {
  background-color: var(--danger-color);
  color: white;
}

.assignment-info {
  margin-bottom: 1rem;
}

.assignment-info p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.assignment-description {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.assignment-description p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.assignment-actions {
  display: flex;
  gap: 0.5rem;
}

.file-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.selected-file {
  font-size: 0.875rem;
  color: var(--primary-color);
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}

.late-warning {
  color: var(--warning-color);
  font-weight: 600;
  margin: 0.5rem 0;
}

.assignment-details {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.assignment-details h3 {
  margin: 0 0 0.5rem 0;
}

.assignment-details p {
  margin: 0.25rem 0;
}

.feedback-content {
  padding: 1rem;
}

.grade-display {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
}

.grade-display h3 {
  margin: 0;
  color: var(--primary-color);
}

.feedback-text h4 {
  margin: 0 0 0.5rem 0;
}

.feedback-text p {
  margin: 0;
  line-height: 1.5;
  color: var(--text-secondary);
}

.submission-details {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.submission-details p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.submit-form {
  margin-top: 1.5rem;
}

input[type="file"] {
  width: 100%;
  padding: 0.5rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  cursor: pointer;
}

input[type="file"]:hover {
  border-color: var(--primary-color);
}
</style>