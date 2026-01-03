<template>
  <div class="attendance-page">
    <div class="page-header">
      <h1>My Attendance</h1>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-value">{{ overallStats.percentage }}%</div>
          <div class="stat-label">Overall Attendance</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ overallStats.present }}</div>
          <div class="stat-label">Days Present</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ overallStats.absent }}</div>
          <div class="stat-label">Days Absent</div>
        </div>
      </div>
    </div>
    
    <div class="attendance-controls">
      <div class="control-group">
        <div class="form-group">
          <label for="subjectFilter">Filter by Subject</label>
          <select id="subjectFilter" v-model="selectedSubject" @change="loadAttendance">
            <option value="">All Subjects</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="dateRange">Date Range</label>
          <select id="dateRange" v-model="dateRange" @change="onDateRangeChange">
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        
        <div v-if="dateRange === 'custom'" class="custom-range">
          <div class="form-group">
            <label for="startDate">From</label>
            <input type="date" id="startDate" v-model="customStartDate">
          </div>
          <div class="form-group">
            <label for="endDate">To</label>
            <input type="date" id="endDate" v-model="customEndDate">
          </div>
          <button @click="loadAttendance" class="btn btn-secondary">
            Apply
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      Loading attendance records...
    </div>
    
    <div v-else-if="attendanceBySubject.length === 0" class="empty-state">
      <p>No attendance records found.</p>
    </div>
    
    <div v-else class="attendance-content">
      <!-- Subject-wise Attendance -->
      <div v-for="subject in attendanceBySubject" :key="subject.subject_id" class="subject-attendance">
        <div class="subject-header">
          <h2>{{ subject.subject_name }}</h2>
          <div class="subject-stats">
            <div class="stat">
              <span class="stat-label">Attendance:</span>
              <span class="stat-value">{{ subject.stats.percentage }}%</span>
            </div>
            <div class="stat">
              <span class="stat-label">Present:</span>
              <span class="stat-value present">{{ subject.stats.present }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Absent:</span>
              <span class="stat-value absent">{{ subject.stats.absent }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Total:</span>
              <span class="stat-value">{{ subject.stats.total }}</span>
            </div>
          </div>
        </div>
        
        <div class="attendance-calendar">
          <div class="calendar-header">
            <h3>Recent Attendance</h3>
            <button @click="toggleCalendar(subject.subject_id)" class="btn btn-text">
              {{ showCalendar[subject.subject_id] ? 'Hide' : 'Show All' }}
            </button>
          </div>
          
          <div v-if="showCalendar[subject.subject_id]" class="calendar-grid">
            <div class="calendar-day" v-for="record in subject.records" :key="record.id">
              <div class="day-date">{{ formatDay(record.date) }}</div>
              <div class="day-status" :class="record.status.toLowerCase()">
                {{ record.status === 'PRESENT' ? '✓' : '✗' }}
              </div>
              <div class="day-info">
                <div class="day-weekday">{{ formatWeekday(record.date) }}</div>
                <div class="day-status-text">{{ record.status }}</div>
              </div>
            </div>
          </div>
          
          <div v-else class="recent-records">
            <div v-for="record in recentRecords(subject.records)" :key="record.id" class="recent-record">
              <div class="record-date">{{ formatDate(record.date) }}</div>
              <div class="record-status" :class="record.status.toLowerCase()">
                {{ record.status }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="attendance-table-container" v-if="subject.records.length > 0">
          <table class="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Status</th>
                <th>Marked At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in subject.records" :key="record.id">
                <td>{{ formatDate(record.date) }}</td>
                <td>{{ formatWeekday(record.date) }}</td>
                <td>
                  <span :class="['status-badge', record.status.toLowerCase()]">
                    {{ record.status }}
                  </span>
                </td>
                <td>{{ formatTime(record.marked_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Attendance Summary -->
      <div class="summary-section">
        <h2>Attendance Summary</h2>
        <div class="summary-content">
          <div class="summary-stats">
            <div class="summary-stat">
              <div class="summary-label">Overall Attendance Rate</div>
              <div class="summary-value">{{ overallStats.percentage }}%</div>
              <div class="summary-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: overallStats.percentage + '%' }"></div>
                </div>
              </div>
            </div>
            
            <div class="summary-stat">
              <div class="summary-label">Best Subject</div>
              <div class="summary-value">{{ bestSubject?.name || 'N/A' }}</div>
              <div class="summary-detail" v-if="bestSubject">
                {{ bestSubject.percentage }}% attendance
              </div>
            </div>
            
            <div class="summary-stat">
              <div class="summary-label">Current Streak</div>
              <div class="summary-value">{{ currentStreak }}</div>
              <div class="summary-detail">consecutive present days</div>
            </div>
          </div>
          
          <div class="summary-chart">
            <div class="chart-placeholder">
              <div class="chart-text">Attendance Trend</div>
              <div class="chart-hint">(Chart visualization would appear here)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import { useSubjectsStore } from '../../store/subjects'
import { useAttendanceStore } from '../../store/attendance'
import { useToast } from '../../composables/useToast'

const authStore = useAuthStore()
const subjectsStore = useSubjectsStore()
const attendanceStore = useAttendanceStore()
const { error: showError } = useToast()

const selectedSubject = ref('')
const dateRange = ref('month')
const customStartDate = ref('')
const customEndDate = ref('')
const showCalendar = ref({})

const subjects = computed(() => subjectsStore.subjects)
const attendanceBySubject = computed(() => attendanceStore.attendanceBySubject)
const loading = computed(() => attendanceStore.loading)

const overallStats = computed(() => {
  return attendanceStore.getAttendanceStats(selectedSubject.value)
})

const bestSubject = computed(() => {
  if (attendanceBySubject.value.length === 0) return null
  
  return attendanceBySubject.value.reduce((best, current) => {
    return current.stats.percentage > best.stats.percentage ? current : best
  })
})

const currentStreak = computed(() => {
  // Simplified streak calculation
  // In a real app, this would calculate consecutive present days
  const records = attendanceStore.attendanceRecords
  
  if (records.length === 0) return 0
  
  // Sort by date descending
  const sorted = [...records].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )
  
  let streak = 0
  const today = new Date()
  
  for (let i = 0; i < sorted.length; i++) {
    const recordDate = new Date(sorted[i].date)
    const diffDays = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24))
    
    if (diffDays !== i) break
    
    if (sorted[i].status === 'PRESENT') {
      streak++
    } else {
      break
    }
  }
  
  return streak
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDay = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).getDate()
}

const formatWeekday = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' })
}

const formatTime = (dateTimeString) => {
  if (!dateTimeString) return ''
  return new Date(dateTimeString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const recentRecords = (records) => {
  return records.slice(0, 3)
}

const toggleCalendar = (subjectId) => {
  showCalendar.value[subjectId] = !showCalendar.value[subjectId]
}

const onDateRangeChange = () => {
  if (dateRange.value === 'custom') {
    // Set default custom dates
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    
    customStartDate.value = thirtyDaysAgo.toISOString().split('T')[0]
    customEndDate.value = today.toISOString().split('T')[0]
  } else {
    loadAttendance()
  }
}

const getDateRange = () => {
  let startDate = ''
  let endDate = new Date().toISOString().split('T')[0]
  
  const today = new Date()
  
  switch (dateRange.value) {
    case 'week':
      const lastWeek = new Date()
      lastWeek.setDate(today.getDate() - 7)
      startDate = lastWeek.toISOString().split('T')[0]
      break
    case 'month':
      const lastMonth = new Date()
      lastMonth.setMonth(today.getMonth() - 1)
      startDate = lastMonth.toISOString().split('T')[0]
      break
    case 'custom':
      startDate = customStartDate.value
      endDate = customEndDate.value
      break
    case 'all':
    default:
      startDate = ''
      endDate = ''
  }
  
  return { startDate, endDate }
}

const loadAttendance = async () => {
  try {
    const { startDate, endDate } = getDateRange()
    
    // In a real implementation, we would pass date range to API
    // For now, we'll just filter client-side
    await attendanceStore.fetchAttendance(selectedSubject.value)
  } catch (err) {
    showError('Error', 'Failed to load attendance records')
  }
}

onMounted(async () => {
  try {
    await subjectsStore.fetchSubjects()
    await loadAttendance()
  } catch (err) {
    showError('Error', 'Failed to load data')
  }
})
</script>

<style scoped>
.attendance-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h1 {
  margin: 0;
  color: var(--text-primary);
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 120px;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
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
  flex-wrap: wrap;
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

.custom-range {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.custom-range .form-group {
  min-width: 150px;
}

.btn-text {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
}

.btn-text:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  color: var(--text-secondary);
}

.attendance-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.subject-attendance {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.subject-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.subject-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 0.25rem;
}

.stat-value.present {
  color: #10b981;
}

.stat-value.absent {
  color: #ef4444;
}

.attendance-calendar {
  margin-bottom: 1.5rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-header h3 {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.calendar-day {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s;
}

.calendar-day:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.day-date {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.day-status {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.day-status.present {
  color: #10b981;
}

.day-status.absent {
  color: #ef4444;
}

.day-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.day-weekday {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.day-status-text {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.recent-records {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.recent-record {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.record-date {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.record-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.record-status.present {
  background-color: #d1fae5;
  color: #065f46;
}

.record-status.absent {
  background-color: #fee2e2;
  color: #991b1b;
}

.attendance-table-container {
  overflow-x: auto;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table th,
.attendance-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.attendance-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.875rem;
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

.summary-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-section h2 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.summary-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.summary-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.summary-detail {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.progress-bar {
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.summary-chart {
  background: #f9fafb;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.chart-placeholder {
  text-align: center;
  color: var(--text-secondary);
}

.chart-text {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.chart-hint {
  font-size: 0.875rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-stats {
    justify-content: center;
  }
  
  .subject-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .subject-stats {
    justify-content: center;
  }
  
  .control-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .custom-range {
    flex-direction: column;
    align-items: stretch;
  }
  
  .summary-content {
    grid-template-columns: 1fr;
  }
  
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>