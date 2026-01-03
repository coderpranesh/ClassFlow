import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { teacherAPI, studentAPI } from '../services/api'
import { useAuthStore } from './auth'

export const useSubjectsStore = defineStore('subjects', () => {
  const authStore = useAuthStore()
  
  const subjects = ref([])
  const loading = ref(false)
  const error = ref(null)

  const teacherSubjects = computed(() => {
    if (authStore.user.role !== 'teacher') return []
    return subjects.value
  })

  const allSubjects = computed(() => {
    return subjects.value
  })

  const getSubjectById = (id) => {
    return subjects.value.find(subject => subject.id == id)
  }

  const fetchSubjects = async () => {
    loading.value = true
    error.value = null
    
    try {
      if (authStore.user.role === 'teacher') {
        const response = await teacherAPI.getSubjects()
        subjects.value = response.data
      } else {
        const response = await studentAPI.getSubjects()
        subjects.value = response.data
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch subjects'
      console.error('Error fetching subjects:', err)
    } finally {
      loading.value = false
    }
  }

  const createSubject = async (name) => {
    if (authStore.user.role !== 'teacher') {
      throw new Error('Only teachers can create subjects')
    }
    
    loading.value = true
    error.value = null
    
    try {
      const response = await teacherAPI.createSubject(name)
      subjects.value.push(response.data.subject)
      return response.data.subject
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create subject'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearSubjects = () => {
    subjects.value = []
  }

  return {
    subjects,
    teacherSubjects,
    allSubjects,
    loading,
    error,
    getSubjectById,
    fetchSubjects,
    createSubject,
    clearError,
    clearSubjects
  }
})