import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const authAPI = {
  login: (email, password) => 
    api.post('/login', { email, password }),
  
  register: (email, password, role) => 
    api.post('/register', { email, password, role }),
  
  getCurrentUser: () => 
    api.get('/me')
}

// Teacher endpoints
export const teacherAPI = {
  // Subjects
  createSubject: (name) => 
    api.post('/api/subjects', { name }),
  
  getSubjects: () => 
    api.get('/api/subjects'),
  
  // Assignments
  createAssignment: (formData) => 
    api.post('/api/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  getAssignments: (subjectId) => 
    api.get(`/api/assignments/${subjectId}`),
  
  getAssignmentSubmissions: (assignmentId) => 
    api.get(`/api/assignments/${assignmentId}/submissions`),
  
  gradeSubmission: (submissionId, grade, feedback) => 
    api.put(`/api/submissions/${submissionId}/grade`, { grade, feedback }),
  
  // Attendance
  markAttendance: (subjectId, date, attendanceRecords) => 
    api.post('/api/attendance/mark', {
      subject_id: subjectId,
      date,
      attendance_records: attendanceRecords
    }),
  
  getSubjectAttendance: (subjectId, startDate, endDate) => 
    api.get(`/api/attendance/${subjectId}`, {
      params: { start_date: startDate, end_date: endDate }
    }),
  
  // Students
  getStudents: () => 
    api.get('/api/students')
}

// Student endpoints
export const studentAPI = {
  // Subjects
  getSubjects: () => 
    api.get('/api/subjects'),
  
  // Assignments
  getSubjectAssignments: (subjectId) => 
    api.get(`/api/assignments/${subjectId}`),
  
  // Submissions
  submitAssignment: (assignmentId, file) => {
    const formData = new FormData()
    formData.append('assignment_id', assignmentId)
    formData.append('file', file)
    
    return api.post('/api/submissions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  getMySubmissions: () => 
    api.get('/api/my-submissions'),
  
  downloadSubmission: (submissionId) => 
    api.get(`/api/download/${submissionId}`, {
      responseType: 'blob'
    }),
  
  // Attendance
  getMyAttendance: (subjectId) => 
    api.get('/api/my-attendance', {
      params: { subject_id: subjectId }
    })
}

export default api