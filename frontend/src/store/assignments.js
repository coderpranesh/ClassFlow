import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { teacherAPI, studentAPI } from '../services/api'
import { useAuthStore } from './auth'

export const useAssignmentsStore = defineStore('assignments', () => {
  const authStore = useAuthStore()
  
  const assignments = ref([])
  const submissions = ref([])
  const loading = ref(false)
  const error = ref(null)

  const pendingAssignments = computed(() => {
    if (authStore.user.role !== 'student') return []
    
    return assignments.value.filter(assignment => {
      const submission = submissions.value.find(s => s.assignment_id === assignment.id)
      return !submission
    })
  })

  const submittedAssignments = computed(() => {
    if (authStore.user.role !== 'student') return []
    
    return assignments.value.filter(assignment => {
      return submissions.value.some(s => s.assignment_id === assignment.id)
    })
  })

  const lateAssignments = computed(() => {
    return assignments.value.filter(assignment => {
      const dueDate = new Date(assignment.due_date)
      const now = new Date()
      return dueDate < now
    })
  })

  const getAssignmentsBySubject = (subjectId) => {
    return assignments.value.filter(assignment => assignment.subject_id == subjectId)
  }

  const getSubmissionForAssignment = (assignmentId) => {
    return submissions.value.find(submission => submission.assignment_id == assignmentId)
  }

  const fetchAssignments = async (subjectId = null) => {
    loading.value = true
    error.value = null
    
    try {
      if (authStore.user.role === 'teacher') {
        if (subjectId) {
          const response = await teacherAPI.getAssignments(subjectId)
          assignments.value = response.data
        } else {
          // Fetch assignments for all subjects
          assignments.value = []
        }
      } else {
        if (subjectId) {
          const response = await studentAPI.getSubjectAssignments(subjectId)
          assignments.value = response.data
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch assignments'
      console.error('Error fetching assignments:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchSubmissions = async (assignmentId = null) => {
    if (authStore.user.role !== 'teacher') return
    
    loading.value = true
    error.value = null
    
    try {
      if (assignmentId) {
        const response = await teacherAPI.getAssignmentSubmissions(assignmentId)
        submissions.value = response.data
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch submissions'
      console.error('Error fetching submissions:', err)
    } finally {
      loading.value = false
    }
  }

  const createAssignment = async (assignmentData) => {
    if (authStore.user.role !== 'teacher') {
      throw new Error('Only teachers can create assignments')
    }
    
    loading.value = true
    error.value = null
    
    try {
      const formData = new FormData()
      formData.append('subject_id', assignmentData.subject_id)
      formData.append('title', assignmentData.title)
      formData.append('description', assignmentData.description || '')
      formData.append('due_date', assignmentData.due_date)
      
      const response = await teacherAPI.createAssignment(formData)
      assignments.value.push(response.data.assignment)
      return response.data.assignment
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create assignment'
      throw err
    } finally {
      loading.value = false
    }
  }

  const submitAssignment = async (assignmentId, file) => {
    if (authStore.user.role !== 'student') {
      throw new Error('Only students can submit assignments')
    }
    
    loading.value = true
    error.value = null
    
    try {
      const response = await studentAPI.submitAssignment(assignmentId, file)
      
      // Update submissions
      submissions.value.push(response.data.submission)
      
      // Update assignment status
      const assignmentIndex = assignments.value.findIndex(a => a.id === assignmentId)
      if (assignmentIndex !== -1) {
        assignments.value[assignmentIndex].submitted = true
        assignments.value[assignmentIndex].my_submission = response.data.submission
      }
      
      return response.data.submission
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to submit assignment'
      throw err
    } finally {
      loading.value = false
    }
  }

  const gradeSubmission = async (submissionId, grade, feedback) => {
    if (authStore.user.role !== 'teacher') {
      throw new Error('Only teachers can grade submissions')
    }
    
    loading.value = true
    error.value = null
    
    try {
      const response = await teacherAPI.gradeSubmission(submissionId, grade, feedback)
      
      // Update submission
      const submissionIndex = submissions.value.findIndex(s => s.id === submissionId)
      if (submissionIndex !== -1) {
        submissions.value[submissionIndex] = response.data.submission
      }
      
      return response.data.submission
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to grade submission'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMySubmissions = async () => {
    if (authStore.user.role !== 'student') return
    
    loading.value = true
    error.value = null
    
    try {
      const response = await studentAPI.getMySubmissions()
      submissions.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch submissions'
      console.error('Error fetching submissions:', err)
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearAssignments = () => {
    assignments.value = []
  }

  return {
    assignments,
    submissions,
    pendingAssignments,
    submittedAssignments,
    lateAssignments,
    loading,
    error,
    getAssignmentsBySubject,
    getSubmissionForAssignment,
    fetchAssignments,
    fetchSubmissions,
    createAssignment,
    submitAssignment,
    gradeSubmission,
    fetchMySubmissions,
    clearError,
    clearAssignments
  }
})