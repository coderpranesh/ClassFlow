
# 📚 ClassFlow  
### Assignment Submission & Attendance Management System

ClassFlow is a full-stack web application that helps teachers manage assignments and attendance, while enabling students to submit assignments and track academic progress.

---

## 🚀 Features

### 👨‍🏫 Teacher
- Create and manage subjects  
- Upload assignments with deadlines  
- Mark attendance subject-wise  
- Review submissions and assign grades  

### 👨‍🎓 Student
- View subjects and assignments  
- Submit assignments (file upload)  
- Track attendance  
- View grades and feedback  

### 🔐 Security
- JWT-based authentication  
- Role-based access control  
- Secure file uploads  
- Password hashing  

---

## 🛠 Tech Stack

**Backend**
- Python
- Flask
- SQLAlchemy
- JWT
- SQLite (development)

**Frontend**
- Vue 3
- Vite
- Pinia
- Axios
- CSS

---

## ⚡ Installation

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python init_db.py
python app.py


Backend runs on: `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 📁 Project Structure

```
classflow/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── auth.py
│   └── uploads/
├── frontend/
│   ├── src/
│   └── vite.config.js
└── README.md
```

---

## 🌐 API Overview

**Auth**

* `POST /register`
* `POST /login`

**Teacher**

* `POST /api/subjects`
* `POST /api/assignments`
* `POST /api/attendance/mark`

**Student**

* `GET /api/subjects`
* `POST /api/submissions`
* `GET /api/my-attendance`

---

## 🧪 Demo Credentials

**Teacher**

```
teacher@classflow.com
teacher123
```

**Student**

```
student@classflow.com
student123
```

---

## 📝 License

MIT License

---

## 👤 Author

**Pranesh Kumar**


⭐ Star the repository if you find it useful!

```

---

If you want, I can also give:
- 🔹 **1-page recruiter README**
- 🔹 **Resume-linked GitHub README**
- 🔹 **Project description for internships**

Just say 👍
```
