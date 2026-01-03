<template>
  <div class="attendance-page">
    <div class="page-header">
      <h1>Attendance Management</h1>
    </div>
    
    <div class="attendance-controls">
      <div class="control-group">
        <div class="form-group">
          <label for="subject">Select Subject</label>
          <select id="subject" v-model="selectedSubject" @change="onSubjectChange">
            <option value="">Choose a subject</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="attendanceDate">Date</label>
          <input
            type="date"
            id="attendanceDate"
            v-model="attendanceDate"
            :max="maxDate"
          />
        </div>
        
        <button 
          @click="loadStudents" 
          class="btn btn-primary"
          :disabled="!selectedSubject || !attendanceDate || loading"
        >
          {{ loading ? 'Loading...' : 'Load Students' }}
        </button>
      </div>
    </div>
    
    <div v-if="error" class="error-alert">
      {{ error }}
    </div>
    
    <div v-if="students.length > 0" class="attendance-section">
      <div class="section-header">
        <h2>
          Mark Attendance for 
          <span class="subject-name">{{ selectedSubjectName }}</span>
          on {{ formatDate(attendanceDate) }}
        </h2>
        <div class="attendance-actions">
          <button @click="markAllPresent" class="btn btn-secondary">
            Mark All Present
          </button>
          <button @click="markAllAbsent" class="btn btn-secondary">
            Mark All Absent
          </button>
        </div>
      </div>
      
      <div class="attendance-table-container">
        <table class="attendance-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.id }}</td>
              <td>{{ student.email }}</td>
              <td>
                <span :class="['status-badge', attendanceStatus[student.id]]">
                  {{ attendanceStatus[student.id] || 'Not Marked' }}
                </span>
              </td>
              <td>
                <div class="status-buttons">
                  <button 
                    @click="markStudent(student.id, 'PRESENT')"
                    :class="['btn', 'btn-status', attendanceStatus[student.id] === 'PRESENT' ? 'active' : '']"
                  >
                    Present
                  </button>
                  <button 
                    @click="markStudent(student.id, 'ABSENT')"
                    :class="['btn', 'btn-status', attendanceStatus[student.id] === 'ABSENT' ? 'active' : '']"
                  >
                    Absent
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="submit-section">
        <button 
          @click="submitAttendance" 
          class="btn btn-primary btn-large"
          :disabled="saving || !hasChanges"
        >
          {{ saving ? 'Saving...' : 'Save Attendance' }}
        </button>
        <p v-if="hasChanges" class="changes-notice">
          You have unsaved changes
        </p>
      </div>
    </div>
    
    <div v-else-if="selectedSubject && attendanceDate && !loading" class="empty-state">
      <p>No students found for this subject.</p>
    </div>
    
    <div class="attendance-history" v-if="selectedSubject">
      <h3>Attendance History</h3>
      <div class="history-filters">
        <div class="form-group">
          <label for="startDate">From</label>
          <input type="date" id="startDate" v-model="startDate">
        </div>
        <div class="form-group">
          <label for="endDate">To</label>
          <input type="date" id="endDate" v-model="endDate">
        </div>
        <button @click="loadHistory" class="btn btn-secondary">
          Load History
        </button>
      </div>
      
      <div v-if="historyLoading" class="loading">Loading history...</div>
      
      <div v-else-if="attendanceHistory.length > 0" class="history-table-container">
        <table class="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student</th>
              <th>Status</th>
              <th>Marked At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in attendanceHistory" :key="record.id">
              <td>{{ formatDate(record.date) }}</td>
              <td>{{ record.student_email }}</td>
              <td>
                <span :class="['status-badge', record.status.toLowerCase()]">
                  {{ record.status }}
                </span>
              </td>
              <td>{{ formatDateTime(record.marked_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="empty-history">
        <p>No attendance records found for the selected period.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import { useToast } from '../../composables/useToast'
import { useSubjectsStore } from '../../store/subjects'
import { useAttendanceStore } from '../../store/attendance'

const authStore = useAuthStore()
const subjectsStore = useSubjectsStore()
const attendanceStore = useAttendanceStore()
const { success, error: showError } = useToast()

const selectedSubject = ref('')
const attendanceDate = ref(new Date().toISOString().split('T')[0])
const startDate = ref('')
const endDate = ref('')
const attendanceStatus = ref({})
const originalStatus = ref({})
const saving = ref(false)
const historyLoading = ref(false)

const subjects = computed(() => subjectsStore.subjects)
const students = computed(() => attendanceStore.students)
const attendanceHistory = computed(() => attendanceStore.attendanceRecords)
const loading = computed(() => attendanceStore.loading)
const error = computed(() => attendanceStore.error)

const selectedSubjectName = computed(() => {
  const subject = subjects.value.find(s => s.id == selectedSubject.value)
  return subject ? subject.name : ''
})

const maxDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const hasChanges = computed(() => {
  return JSON.stringify(attendanceStatus.value) !== JSON.stringify(originalStatus.value)
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return ''
  return new Date(dateTimeString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const onSubjectChange = () => {
  attendanceStatus.value = {}
  originalStatus.value = {}
}

const loadStudents = async () => {
  if (!selectedSubject.value || !attendanceDate.value) return
  
  try {
    await attendanceStore.fetchStudents()
    
    // Initialize attendance status for each student
    const status = {}
    students.value.forEach(student => {
      status[student.id] = 'PRESENT' // Default to present
    })
    
    attendanceStatus.value = { ...status }
    originalStatus.value = { ...status }
  } catch (err) {
    showError('Error', 'Failed to load students')
  }
}

const markAllPresent = () => {
  students.value.forEach(student => {
    attendanceStatus.value[student.id] = 'PRESENT'
  })
}

const markAllAbsent = () => {
  students.value.forEach(student => {
    attendanceStatus.value[student.id] = 'ABSENT'
  })
}

const markStudent = (studentId, status) => {
  attendanceStatus.value[studentId] = status
}

const submitAttendance = async () => {
  if (!selectedSubject.value || !attendanceDate.value || students.value.length === 0) {
    showError('Error', 'Please select subject, date, and load students first')
    return
  }
  
  saving.value = true
  
  try {
    const records = students.value.map(student => ({
      student_id: student.id,
      status: attendanceStatus.value[student.id] || 'PRESENT'
    }))
    
    await attendanceStore.markAttendance(selectedSubject.value, attendanceDate.value, records)
    
    originalStatus.value = { ...attendanceStatus.value }
    success('Success', 'Attendance saved successfully!')
    
    // Load updated history
    await loadHistory()
  } catch (err) {
    showError('Error', 'Failed to save attendance')
  } finally {
    saving.value = false
  }
}

const loadHistory = async () => {
  if (!selectedSubject.value) return
  
  historyLoading.value = true
  try {
    await attendanceStore.fetchAttendance(selectedSubject.value, {
      startDate: startDate.value,
      endDate: endDate.value
    })
  } catch (err) {
    showError('Error', 'Failed to load attendance history')
  } finally {
    historyLoading.value = false
  }
}

onMounted(async () => {
  try {
    await subjectsStore.fetchSubjects()
    
    // Set default dates for history
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    startDate.value = firstDay.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]
  } catch (err) {
    showError('Error', 'Failed to load subjects')
  }
})
</script>

<style scoped>
.attendance-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header h1 {
  margin: 0;
  color: var(--text-primary);
}

.attendance-controls {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.control-group {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.form-group label {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-group select,
.form-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.error-alert {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
}

.attendance-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.subject-name {
  color: var(--primary-color);
  font-weight: 600;
}

.attendance-actions {
  display: flex;
  gap: 0.5rem;
}

.attendance-table-container {
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table th,
.attendance-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.attendance-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.attendance-table tbody tr:hover {
  background-color: #f9fafb;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.present {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.absent {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-badge.not-marked {
  background-color: #f3f4f6;
  color: #6b7280;
}

.status-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-status {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background-color: white;
  color: var(--text-secondary);
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-status:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-status.active {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
  color: white;
}

.submit-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-large {
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
}

.changes-notice {
  color: var(--warning-color);
  font-size: 0.875rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  color: var(--text-secondary);
}

.attendance-history {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.attendance-history h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.history-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-end;
}

.history-filters .form-group {
  min-width: 150px;
}

.history-table-container {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.history-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.empty-history {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  background-color: #f9fafb;
  border-radius: 0.5rem;
}
</style>