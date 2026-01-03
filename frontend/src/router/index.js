import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

// Layouts
const DefaultLayout = () => import('../components/layouts/DefaultLayout.vue')
const AuthLayout = () => import('../components/layouts/AuthLayout.vue')

// Views
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/auth/login.vue')
const Register = () => import('../views/auth/Register.vue')

// Teacher views
const TeacherDashboard = () => import('../views/teacher/Dashboard.vue')
const TeacherSubjects = () => import('../views/teacher/Subjects.vue')
const TeacherAssignments = () => import('../views/teacher/Assignments.vue')
const TeacherAttendance = () => import('../views/teacher/Attendance.vue')

// Student views
const StudentDashboard = () => import('../views/student/Dashboard.vue')
const StudentAssignments = () => import('../views/student/Assignments.vue')
const StudentAttendance = () => import('../views/student/Attendance.vue')
const StudentSubmissions = () => import('../views/student/Submissions.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { requiresAuth: false },
    children: [
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register }
    ]
  },
  {
    path: '/teacher',
    component: DefaultLayout,
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      { path: 'dashboard', name: 'TeacherDashboard', component: TeacherDashboard },
      { path: 'subjects', name: 'TeacherSubjects', component: TeacherSubjects },
      { path: 'assignments', name: 'TeacherAssignments', component: TeacherAssignments },
      { path: 'attendance', name: 'TeacherAttendance', component: TeacherAttendance }
    ]
  },
  {
    path: '/student',
    component: DefaultLayout,
    meta: { requiresAuth: true, role: 'student' },
    children: [
      { path: 'dashboard', name: 'StudentDashboard', component: StudentDashboard },
      { path: 'assignments', name: 'StudentAssignments', component: StudentAssignments },
      { path: 'attendance', name: 'StudentAttendance', component: StudentAttendance },
      { path: 'submissions', name: 'StudentSubmissions', component: StudentSubmissions }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } else if (to.meta.requiresAuth && authStore.isAuthenticated) {
    // Check role if route requires specific role
    if (to.meta.role && authStore.user.role !== to.meta.role) {
      // Redirect to appropriate dashboard
      if (authStore.user.role === 'teacher') {
        next('/teacher/dashboard')
      } else {
        next('/student/dashboard')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router