# ClassFlow - Assignment Submission & Attendance Management System

<div align="center">

![ClassFlow Logo](https://img.shields.io/badge/ClassFlow-Academic%20Management-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

A comprehensive web application for managing assignments and attendance in educational institutions

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

ClassFlow is a full-stack web application designed to streamline academic workflow for educational institutions. It provides separate interfaces for teachers and students with role-based access control for managing assignments, submissions, and attendance.

### Key Benefits

- **For Teachers**: Easy subject management, assignment creation, attendance tracking, and student progress monitoring
- **For Students**: Simple assignment submission, attendance tracking, and grade viewing
- **For Institutions**: Centralized academic management with detailed analytics and reporting

## ✨ Features

### 👨‍🏫 Teacher Features
- **Subject Management**: Create and manage subjects
- **Assignment Creation**: Upload assignments with due dates and descriptions
- **Attendance Tracking**: Mark and view attendance subject-wise
- **Submission Review**: Grade assignments and provide feedback
- **Student Management**: View student progress and statistics
- **Dashboard Analytics**: Comprehensive insights into class performance

### 👨‍🎓 Student Features
- **Assignment Submission**: Submit assignments with file uploads
- **Attendance Tracking**: View personal attendance records
- **Grade Management**: Check grades and teacher feedback
- **Submission History**: Track all submissions and their status
- **Progress Monitoring**: View academic progress across subjects
- **File Management**: Download submitted assignments

### 🛡️ Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Separate interfaces for teachers and students
- **File Validation**: Secure file uploads with type and size validation
- **Password Hashing**: Secure password storage using Werkzeug
- **SQL Injection Protection**: Using SQLAlchemy ORM
- **XSS Protection**: Built-in Vue.js security features

## 🚀 Tech Stack

### Backend
- **Python 3.8+**
- **Flask**: Web framework
- **SQLAlchemy**: ORM for database operations
- **JWT**: Token-based authentication
- **SQLite**: Database (development)
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **Vue 3**: Progressive JavaScript framework
- **Vue Router**: Client-side routing
- **Pinia**: State management
- **Axios**: HTTP client
- **Vite**: Build tool and dev server
- **CSS3**: Custom styling with responsive design

## ⚡ Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### One-Command Setup (For Development)
```bash
# Clone the repository
git clone https://github.com/yourusername/classflow.git
cd classflow

# Run setup script (Linux/macOS)
chmod +x setup.sh
./setup.sh

# Or run setup manually (Windows)
# See detailed installation below
```

## 🔧 Installation

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
```

3. **Activate virtual environment:**
- **Windows:**
```bash
venv\Scripts\activate
```
- **macOS/Linux:**
```bash
source venv/bin/activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Initialize database:**
```bash
python init_db.py
```

6. **Run backend server:**
```bash
python app.py
```
Backend will run at: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```
Frontend will run at: `http://localhost:3000`

## 📁 Project Structure

```
classflow/
├── backend/                 # Flask backend
│   ├── app.py              # Main application
│   ├── models.py           # Database models
│   ├── auth.py             # Authentication module
│   ├── teacher_routes.py   # Teacher API endpoints
│   ├── student_routes.py   # Student API endpoints
│   ├── config.py           # Configuration settings
│   ├── requirements.txt    # Python dependencies
│   ├── init_db.py         # Database initialization
│   └── uploads/           # File upload directory
├── frontend/              # Vue.js frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── layouts/   # Layout components
│   │   │   └── common/    # Common UI components
│   │   ├── views/         # Page components
│   │   │   ├── auth/      # Authentication views
│   │   │   ├── teacher/   # Teacher views
│   │   │   └── student/   # Student views
│   │   ├── router/        # Vue Router configuration
│   │   ├── store/         # Pinia stores
│   │   ├── services/      # API services
│   │   ├── composables/   # Composable functions
│   │   ├── App.vue        # Root component
│   │   └── main.js        # Application entry point
│   ├── index.html         # HTML template
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
└── README.md             # This file
```

## 🌐 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register a new user | No |
| `POST` | `/login` | Login and get JWT token | No |
| `GET` | `/me` | Get current user info | Yes |

### Teacher Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/subjects` | Create a new subject | Teacher |
| `GET` | `/api/subjects` | Get all teacher's subjects | Teacher |
| `POST` | `/api/assignments` | Create a new assignment | Teacher |
| `GET` | `/api/assignments/<subject_id>` | Get assignments for a subject | Teacher |
| `POST` | `/api/attendance/mark` | Mark attendance | Teacher |
| `GET` | `/api/attendance/<subject_id>` | Get attendance for a subject | Teacher |
| `GET` | `/api/students` | Get all students | Teacher |

### Student Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/subjects` | Get all subjects | Student |
| `GET` | `/api/assignments/<subject_id>` | Get assignments for a subject | Student |
| `POST` | `/api/submissions` | Submit an assignment | Student |
| `GET` | `/api/my-submissions` | Get student's submissions | Student |
| `GET` | `/api/my-attendance` | Get student's attendance | Student |
| `GET` | `/api/download/<submission_id>` | Download a submission file | Student |

## 🧪 Testing Credentials

### Demo Accounts

**Teacher Account:**
- Email: `teacher@classflow.com`
- Password: `teacher123`

**Student Account:**
- Email: `student@classflow.com`
- Password: `student123`

**Admin Account:**
- Email: `admin@classflow.com`
- Password: `admin123`

## 📊 Database Schema

```sql
Users
├── id (PK)
├── email (Unique)
├── password_hash
├── role (teacher/student)
├── active
└── created_at

Subjects
├── id (PK)
├── name
├── teacher_id (FK → Users.id)
└── created_at

Assignments
├── id (PK)
├── subject_id (FK → Subjects.id)
├── title
├── description
├── due_date
└── created_at

Submissions
├── id (PK)
├── assignment_id (FK → Assignments.id)
├── student_id (FK → Users.id)
├── file_path
├── submitted_at
├── grade
├── feedback
└── UNIQUE(assignment_id, student_id)

Attendance
├── id (PK)
├── subject_id (FK → Subjects.id)
├── student_id (FK → Users.id)
├── date
├── status (PRESENT/ABSENT)
├── marked_at
└── UNIQUE(subject_id, student_id, date)
```

## 🚀 Deployment

### Backend Deployment (Production)

1. **Use production web server:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

2. **Use production database:**
- Update `config.py` to use PostgreSQL or MySQL
- Set environment variables for database credentials

3. **Configure environment variables:**
```bash
export SECRET_KEY=your-secret-key
export JWT_SECRET_KEY=your-jwt-secret
export DATABASE_URL=postgresql://user:password@localhost/classflow
```

### Frontend Deployment (Production)

1. **Build for production:**
```bash
cd frontend
npm run build
```

2. **Serve with Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/classflow/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. **Set up SSL (HTTPS):**
```bash
# Use Let's Encrypt for free SSL certificates
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///classflow.db

# File Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216  # 16MB
ALLOWED_EXTENSIONS=pdf,doc,docx,txt,zip

# CORS Configuration (for development)
CORS_ORIGINS=http://localhost:3000
```

### File Upload Configuration

- **Allowed file types**: PDF, DOC, DOCX, TXT, ZIP
- **Maximum file size**: 16MB
- **Upload directory**: `backend/uploads/`
- **File naming**: `{user_id}_{assignment_id}_{timestamp}_{filename}`

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors:**
```bash
# Delete and recreate database
rm backend/classflow.db
python backend/init_db.py
```

2. **Port already in use:**
```bash
# Find and kill process using port 5000
sudo lsof -i :5000
kill -9 <PID>

# Or change port in app.py
app.run(debug=True, port=5001)
```

3. **Frontend not connecting to backend:**
- Check CORS configuration
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify proxy configuration in `vite.config.js`

4. **File upload issues:**
- Check `uploads` directory permissions
- Verify file size limit
- Check allowed file extensions

### Debug Mode

Enable debug mode for detailed error messages:

```python
# In backend/app.py
app.run(debug=True, host='0.0.0.0', port=5000)
```

Check logs:
- Backend: Console output
- Frontend: Browser Developer Tools (F12)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
```bash
git checkout -b feature/AmazingFeature
```
3. **Commit your changes:**
```bash
git commit -m 'Add some AmazingFeature'
```
4. **Push to the branch:**
```bash
git push origin feature/AmazingFeature
```
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript/Vue code
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Flask team for the amazing web framework
- Vue.js team for the progressive JavaScript framework
- All contributors who have helped shape ClassFlow
- Educational institutions for inspiring this project

## 📞 Contact

**Project Maintainer:** Your Name  
**Email:** your.email@example.com  
**Project Link:** [https://github.com/yourusername/classflow](https://github.com/yourusername/classflow)

## 🔮 Roadmap

### Planned Features
- [ ] Real-time notifications
- [ ] Mobile applications (React Native)
- [ ] Calendar integration
- [ ] Video lecture hosting
- [ ] Quiz and test modules
- [ ] Parent portal access
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

### Version History
- **v1.0.0** (Current): Initial release with core features
- **v0.9.0**: Beta testing and bug fixes
- **v0.5.0**: MVP with basic functionality
- **v0.1.0**: Project initiation

---

<div align="center">
  
Made with ❤️ for the education community

⭐ Star us on GitHub if you find this project useful!

</div>