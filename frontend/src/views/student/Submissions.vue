<template>
  <div class="submissions-page">
    <h1>My Submissions</h1>
    
    <div v-if="loading" class="loading">Loading submissions...</div>
    
    <div v-else-if="submissions.length === 0" class="empty-state">
      <p>No submissions yet.</p>
      <router-link to="/student/assignments" class="btn btn-primary">
        View Assignments to Submit
      </router-link>
    </div>
    
    <div v-else class="submissions-list">
      <div v-for="submission in submissions" :key="submission.id" class="submission-card">
        <div class="submission-header">
          <h3>{{ submission.assignment_title || 'Assignment' }}</h3>
          <span :class="['status', submission.is_late ? 'late' : 'on-time']">
            {{ submission.is_late ? 'Late Submission' : 'On Time' }}
          </span>
        </div>
        
        <div class="submission-info">
          <p><strong>Subject:</strong> {{ submission.subject_name || 'N/A' }}</p>
          <p><strong>Submitted:</strong> {{ formatDate(submission.submitted_at) }}</p>
          <p><strong>Grade:</strong> 
            <span v-if="submission.grade" class="grade">{{ submission.grade }}</span>
            <span v-else class="no-grade">Not graded yet</span>
          </p>
        </div>
        
        <div class="submission-actions">
          <button @click="downloadSubmission(submission.id)" class="btn btn-secondary">
            Download
          </button>
          <button v-if="submission.feedback" @click="showFeedback(submission)" class="btn">
            View Feedback
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'

export default {
  name: 'StudentSubmissions',
  setup() {
    const authStore = useAuthStore()
    const submissions = ref([])
    const loading = ref(false)
    
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const fetchSubmissions = async () => {
      loading.value = true
      try {
        const response = await authStore.api.get('/api/my-submissions')
        submissions.value = response.data
      } catch (error) {
        console.error('Error fetching submissions:', error)
      } finally {
        loading.value = false
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
        link.setAttribute('download', `submission-${submissionId}.zip`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (error) {
        alert('Failed to download file')
      }
    }
    
    const showFeedback = (submission) => {
      alert(`Feedback: ${submission.feedback || 'No feedback provided'}`)
    }
    
    onMounted(() => {
      fetchSubmissions()
    })
    
    return {
      submissions,
      loading,
      formatDate,
      downloadSubmission,
      showFeedback
    }
  }
}
</script>

<style scoped>
.submissions-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.submission-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #4f46e5;
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.submission-header h3 {
  margin: 0;
  color: #111827;
}

.status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.status.on-time {
  background-color: #d1fae5;
  color: #065f46;
}

.status.late {
  background-color: #fef3c7;
  color: #92400e;
}

.submission-info {
  margin-bottom: 1rem;
}

.submission-info p {
  margin: 0.5rem 0;
  color: #6b7280;
}

.grade {
  font-weight: bold;
  color: #10b981;
}

.no-grade {
  color: #9ca3af;
  font-style: italic;
}

.submission-actions {
  display: flex;
  gap: 0.5rem;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
</style>