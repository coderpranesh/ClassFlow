<template>
  <div class="dashboard">
    <h1>Student Dashboard</h1>
    
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
          <h3>{{ pendingAssignments.length }}</h3>
          <p>Pending Assignments</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ submittedAssignments.length }}</h3>
          <p>Submitted</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>{{ attendancePercentage }}%</h3>
          <p>Attendance</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-sections">
      <!-- Pending Assignments -->
      <div class="section">
        <h2>Pending Assignments</h2>
        <div v-if="pendingAssignments.length > 0" class="assignments-list">
          <div v-for="assignment in pendingAssignments.slice(0, 3)" :key="assignment.id" 
               class="assignment-item">
            <div class="assignment-info">
              <h4>{{ assignment.title }}</h4>
              <p>{{ assignment.subject_name }}</p>
              <p class="due-date">
                Due: {{ formatDate(assignment.due_date) }}
                <span v-if="isPastDue(assignment.due_date)" class="late">(Late)</span>
              </p>
            </div>
            <router-link 
              :to="`/student/assignments?assignment=${assignment.id}`"
              class="btn btn-primary"
            >
              Submit
            </router-link>
          </div>
        </div>
        <p v-else>No pending assignments. Great job!</p>
      </div>
      
      <!-- Recent Submissions -->
      <div class="section">
        <h2>Recent Submissions</h2>
        <div v-if="recentSubmissions.length > 0" class="submissions-list">
          <div v-for="submission in recentSubmissions" :key="submission.id" 
               class="submission-item">
            <div class="submission-info">
              <h4>{{ submission.assignment_title }}</h4>
              <p>{{ submission.subject_name }}</p>
              <p class="submission-date">
                Submitted: {{ formatDate(submission.submitted_at) }}
                <span v-if="submission.is_late" class="late">(Late)</span>
              </p>
              <p v-if="submission.grade" class="grade">
                Grade: <strong>{{ submission.grade }}</strong>
              </p>
            </div>
          </div>
        </div>
        <p v-else>No submissions yet</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()

const subjects = ref([])
const assignments = ref([])
const submissions = ref([])
const attendance = ref([])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const isPastDue = (dueDate) => {
  return new Date(dueDate) < new Date()
}

const pendingAssignments = computed(() => {
  return assignments.value.filter(assignment => {
    const submission = submissions.value.find(s => s.assignment_id === assignment.id)
    return !submission
  })
})

const submittedAssignments = computed(() => {
  return assignments.value.filter(assignment => {
    return submissions.value.some(s => s.assignment_id === assignment.id)
  })
})

const recentSubmissions = computed(() => {
  return [...submissions.value]
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .slice(0, 3)
    .map(submission => {
      const assignment = assignments.value.find(a => a.id === submission.assignment_id)
      return {
        ...submission,
        assignment_title: assignment?.title || 'Unknown',
        subject_name: assignment?.subject_name || 'Unknown'
      }
    })
})

const attendancePercentage = computed(() => {
  if (attendance.value.length === 0) return 0
  
  const present = attendance.value.filter(a => a.status === 'PRESENT').length
  return Math.round((present / attendance.value.length) * 100)
})

const fetchData = async () => {
  try {
    // Fetch subjects
    const subjectsResponse = await authStore.api.get('/api/subjects')
    subjects.value = subjectsResponse.data
    
    // For each subject, fetch assignments
    for (const subject of subjects.value) {
      const assignmentsResponse = await authStore.api.get(`/api/assignments/${subject.id}`)
      assignments.value.push(...assignmentsResponse.data)
    }
    
    // Fetch submissions
    const submissionsResponse = await authStore.api.get('/api/my-submissions')
    submissions.value = submissionsResponse.data
    
    // Fetch attendance
    const attendanceResponse = await authStore.api.get('/api/my-attendance')
    attendance.value = attendanceResponse.data.attendance || []
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.assignments-list,
.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.assignment-item,
.submission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border-left: 4px solid var(--primary-color);
}

.assignment-info h4,
.submission-info h4 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
}

.assignment-info p,
.submission-info p {
  margin: 0.125rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.due-date,
.submission-date {
  font-weight: 500;
}

.late {
  color: var(--danger-color);
  font-weight: 600;
}

.grade {
  color: var(--secondary-color);
  font-weight: 600;
}
</style>