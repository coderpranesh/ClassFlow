import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { teacherAPI, studentAPI } from '../services/api'
import { useAuthStore } from './auth'

export const useAttendanceStore = defineStore('attendance', () => {
  const authStore = useAuthStore()
  
  const attendanceRecords = ref([])
  const students = ref([])
  const loading = ref(false)
  const error = ref(null)

  const myAttendance = computed(() => {
    if (authStore.user.role !== 'student') return []
    return attendanceRecords.value
  })

  const attendanceBySubject = computed(() => {
    const groups = {}
    attendanceRecords.value.forEach(record => {
      const subjectId = record.subject_id
      if (!groups[subjectId]) {
        groups[subjectId] = {
          subject_id: subjectId,
          subject_name: record.subject_name,
          records: [],
          stats: {
            total: 0,
            present: 0,
            absent: 0,
            percentage: 0
          }
        }
      }
      groups[subjectId].records.push(record)
      groups[subjectId].stats.total++
      if (record.status === 'PRESENT') {
        groups[subjectId].stats.present++
      } else {
        groups[subjectId].stats.absent++
      }
    })

    // Calculate percentages
    Object.values(groups).forEach(group => {
      group.stats.percentage = group.stats.total > 0 
        ? Math.round((group.stats.present / group.stats.total) * 100) 
        : 0
    })

    return Object.values(groups)
  })

  const getAttendanceForSubject = (subjectId) => {
    return attendanceRecords.value.filter(record => record.subject_id == subjectId)
  }

  const getAttendanceForDate = (subjectId, date) => {
    return attendanceRecords.value.filter(record => 
      record.subject_id == subjectId && record.date === date
    )
  }

  const fetchAttendance = async (subjectId = null, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      if (authStore.user.role === 'teacher') {
        if (subjectId) {
          const response = await teacherAPI.getSubjectAttendance(
            subjectId,
            options.startDate,
            options.endDate
          )
          
          if (response.data.attendance) {
            // Flatten the grouped attendance data
            const flattened = []
            response.data.attendance.forEach(group => {
              flattened.push(...group.records)
            })
            attendanceRecords.value = flattened
          }
        }
      } else {
        const response = await studentAPI.getMyAttendance(subjectId)
        attendanceRecords.value = response.data.attendance || []
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch attendance'
      console.error('Error fetching attendance:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchStudents = async () => {
    if (authStore.user.role !== 'teacher') return
    
    loading.value = true
    error.value = null
    
    try {
      const response = await teacherAPI.getStudents()
      students.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch students'
      console.error('Error fetching students:', err)
    } finally {
      loading.value = false
    }
  }

  const markAttendance = async (subjectId, date, records) => {
    if (authStore.user.role !== 'teacher') {
      throw new Error('Only teachers can mark attendance')
    }
    
    loading.value = true
    error.value = null
    
    try {
      const attendanceRecords = records.map(record => ({
        student_id: record.student_id,
        status: record.status
      }))
      
      const response = await teacherAPI.markAttendance(
        subjectId,
        date,
        attendanceRecords
      )
      
      // Refresh attendance records
      await fetchAttendance(subjectId)
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to mark attendance'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getAttendanceStats = (subjectId = null) => {
    const records = subjectId 
      ? attendanceRecords.value.filter(r => r.subject_id == subjectId)
      : attendanceRecords.value
    
    const total = records.length
    const present = records.filter(r => r.status === 'PRESENT').length
    const absent = total - present
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0
    
    return { total, present, absent, percentage }
  }

  const clearError = () => {
    error.value = null
  }

  const clearAttendance = () => {
    attendanceRecords.value = []
    students.value = []
  }

  return {
    attendanceRecords,
    students,
    myAttendance,
    attendanceBySubject,
    loading,
    error,
    getAttendanceForSubject,
    getAttendanceForDate,
    fetchAttendance,
    fetchStudents,
    markAttendance,
    getAttendanceStats,
    clearError,
    clearAttendance
  }
})