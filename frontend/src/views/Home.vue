<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Welcome to ClassFlow</h1>
            <p class="hero-subtitle">
              Streamline your academic workflow with our comprehensive assignment submission 
              and attendance management system.
            </p>
            
            <div class="hero-actions">
              <router-link 
                v-if="!authStore.isAuthenticated"
                to="/auth/login" 
                class="btn btn-primary btn-large"
              >
                Get Started
              </router-link>
              <router-link 
                v-else
                :to="dashboardRoute"
                class="btn btn-primary btn-large"
              >
                Go to Dashboard
              </router-link>
              
              <a href="#features" class="btn btn-outline">
                Learn More
              </a>
            </div>
          </div>
          
          <div class="hero-image">
            <div class="image-placeholder">
              <div class="floating-elements">
                <div class="floating-card card-1">
                  <div class="card-icon">📚</div>
                  <div class="card-text">Manage Subjects</div>
                </div>
                <div class="floating-card card-2">
                  <div class="card-icon">📝</div>
                  <div class="card-text">Submit Assignments</div>
                </div>
                <div class="floating-card card-3">
                  <div class="card-icon">👨‍🏫</div>
                  <div class="card-text">Track Attendance</div>
                </div>
                <div class="floating-card card-4">
                  <div class="card-icon">📊</div>
                  <div class="card-text">View Analytics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Powerful Features for Academic Excellence</h2>
          <p class="section-subtitle">
            Everything you need to manage assignments, attendance, and academic progress in one place.
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h3 class="feature-title">Subject Management</h3>
            <p class="feature-description">
              Teachers can create and manage subjects, organize course materials, 
              and track student enrollment.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3 class="feature-title">Assignment Submission</h3>
            <p class="feature-description">
              Students can submit assignments with file uploads, receive grades and feedback, 
              and track submission history.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">👨‍🏫</div>
            <h3 class="feature-title">Attendance Tracking</h3>
            <p class="feature-description">
              Teachers can mark attendance subject-wise, while students can view their 
              attendance records and statistics.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3 class="feature-title">Role-Based Access</h3>
            <p class="feature-description">
              Secure authentication with separate interfaces for teachers and students, 
              ensuring appropriate access controls.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3 class="feature-title">Analytics Dashboard</h3>
            <p class="feature-description">
              Comprehensive dashboards for both teachers and students to track 
              progress, submissions, and attendance.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3 class="feature-title">Responsive Design</h3>
            <p class="feature-description">
              Access ClassFlow from any device - desktop, tablet, or mobile - 
              with a fully responsive interface.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">How ClassFlow Works</h2>
          <p class="section-subtitle">
            A seamless experience for both teachers and students
          </p>
        </div>
        
        <div class="steps-container">
          <!-- For Teachers -->
          <div class="steps-section">
            <h3 class="steps-title">For Teachers</h3>
            <div class="steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>Create Subjects</h4>
                  <p>Set up subjects and manage student enrollment</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>Upload Assignments</h4>
                  <p>Create assignments with due dates and descriptions</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>Mark Attendance</h4>
                  <p>Track student attendance subject-wise</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>Grade Submissions</h4>
                  <p>Review student submissions and provide feedback</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- For Students -->
          <div class="steps-section">
            <h3 class="steps-title">For Students</h3>
            <div class="steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>View Assignments</h4>
                  <p>Access all assignments with due dates and instructions</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>Submit Work</h4>
                  <p>Upload assignments and track submission status</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>Check Attendance</h4>
                  <p>Monitor your attendance records and statistics</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>Receive Feedback</h4>
                  <p>Get grades and feedback from teachers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Transform Your Academic Experience?</h2>
          <p class="cta-description">
            Join thousands of teachers and students who are already using ClassFlow 
            to streamline their academic workflow.
          </p>
          
          <div class="cta-actions">
            <router-link 
              v-if="!authStore.isAuthenticated"
              to="/auth/register" 
              class="btn btn-primary btn-large"
            >
              Create Free Account
            </router-link>
            <router-link 
              v-else
              :to="dashboardRoute"
              class="btn btn-primary btn-large"
            >
              Continue to Dashboard
            </router-link>
            
            <router-link 
              v-if="!authStore.isAuthenticated"
              to="/auth/login" 
              class="btn btn-outline"
            >
              Already have an account? Login
            </router-link>
          </div>
          
          <div class="demo-info">
            <h4>Demo Accounts</h4>
            <div class="demo-accounts">
              <div class="demo-account">
                <strong>Teacher:</strong> teacher@classflow.com / teacher123
              </div>
              <div class="demo-account">
                <strong>Student:</strong> student@classflow.com / student123
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">ClassFlow</div>
            <p class="footer-tagline">
              Academic Management Made Simple
            </p>
          </div>
          
          <div class="footer-links">
            <div class="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <router-link to="/auth/login">Login</router-link>
              <router-link to="/auth/register">Register</router-link>
            </div>
            
            <div class="footer-column">
              <h4>Support</h4>
              <a href="#">Documentation</a>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
            </div>
            
            <div class="footer-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 ClassFlow. All rights reserved.</p>
          <p>Built with ❤️ for educational institutions worldwide.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()

const dashboardRoute = computed(() => {
  if (authStore.user?.role === 'teacher') {
    return '/teacher/dashboard'
  } else if (authStore.user?.role === 'student') {
    return '/student/dashboard'
  }
  return '/auth/login'
})
</script>

<style scoped>
.home-page {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 1rem;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-text {
  max-width: 600px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.hero-image {
  position: relative;
  height: 400px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-card {
  position: absolute;
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #333;
  animation: float 6s ease-in-out infinite;
}

.floating-card:nth-child(1) { animation-delay: 0s; }
.floating-card:nth-child(2) { animation-delay: 1s; }
.floating-card:nth-child(3) { animation-delay: 2s; }
.floating-card:nth-child(4) { animation-delay: 3s; }

.card-1 {
  top: 10%;
  left: 10%;
}

.card-2 {
  top: 20%;
  right: 15%;
}

.card-3 {
  bottom: 20%;
  left: 15%;
}

.card-4 {
  bottom: 10%;
  right: 10%;
}

.card-icon {
  font-size: 1.5rem;
}

.card-text {
  font-weight: 500;
  white-space: nowrap;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* Features Section */
.features-section {
  padding: 6rem 1rem;
  background: #f9fafb;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
}

/* How It Works Section */
.how-it-works {
  padding: 6rem 1rem;
  background: white;
}

.steps-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1000px;
  margin: 0 auto;
}

.steps-section {
  background: #f9fafb;
  border-radius: 1rem;
  padding: 2rem;
}

.steps-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2rem;
  text-align: center;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-number {
  background: #4f46e5;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #6b7280;
  line-height: 1.5;
}

/* CTA Section */
.cta-section {
  padding: 6rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.cta-description {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.demo-info {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.demo-info h4 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.demo-accounts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-account {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

/* Footer */
.footer {
  background: #111827;
  color: white;
  padding: 4rem 1rem 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand {
  max-width: 300px;
}

.footer-logo {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #4f46e5;
}

.footer-tagline {
  color: #9ca3af;
  line-height: 1.6;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-column h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.footer-column a {
  display: block;
  color: #9ca3af;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
}

.footer-column a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 2rem;
  text-align: center;
  color: #9ca3af;
}

.footer-bottom p {
  margin: 0.5rem 0;
}

/* Responsive Design */
@media (max-width: 992px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .steps-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .floating-card {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-large {
    width: 100%;
  }
  
  .cta-actions {
    flex-direction: column;
  }
  
  .floating-elements {
    display: none;
  }
}
</style>