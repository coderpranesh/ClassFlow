from app import create_app
from models import db, User

app = create_app()

with app.app_context():
    db.create_all()
    
    admin = User.query.filter_by(email='admin@classflow.com').first()
    if not admin:
        admin = User(
            email='admin@classflow.com',
            role='teacher'
        )
        admin.set_password('admin123')
        db.session.add(admin)
    
    # Create sample teacher
    teacher = User.query.filter_by(email='teacher@classflow.com').first()
    if not teacher:
        teacher = User(
            email='teacher@classflow.com',
            role='teacher'
        )
        teacher.set_password('teacher123')
        db.session.add(teacher)
    
    # Create sample student
    student = User.query.filter_by(email='student@classflow.com').first()
    if not student:
        student = User(
            email='student@classflow.com',
            role='student'
        )
        student.set_password('student123')
        db.session.add(student)
    
    db.session.commit()
    print("Database initialized successfully!")