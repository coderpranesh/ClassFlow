import os
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from models import db, Subject, Assignment, Attendance, User, Submission
from auth import token_required, role_required

teacher_bp = Blueprint('teacher', __name__)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

# Subject Management
@teacher_bp.route('/subjects', methods=['POST'])
@role_required('teacher')
def create_subject(current_user):
    """Create a new subject"""
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'message': 'Subject name is required!'}), 400
    
    # Check if subject already exists for this teacher
    existing_subject = Subject.query.filter_by(
        name=data['name'],
        teacher_id=current_user.id
    ).first()
    
    if existing_subject:
        return jsonify({'message': 'Subject already exists!'}), 400
    
    # Create new subject
    new_subject = Subject(
        name=data['name'],
        teacher_id=current_user.id
    )
    
    db.session.add(new_subject)
    db.session.commit()
    
    return jsonify({
        'message': 'Subject created successfully!',
        'subject': new_subject.to_dict()
    }), 201

@teacher_bp.route('/subjects', methods=['GET'])
@role_required('teacher')
def get_teacher_subjects(current_user):
    """Get all subjects taught by current teacher"""
    subjects = Subject.query.filter_by(teacher_id=current_user.id).all()
    return jsonify([subject.to_dict() for subject in subjects]), 200

# Assignment Management
@teacher_bp.route('/assignments', methods=['POST'])
@role_required('teacher')
def create_assignment(current_user):
    """Create a new assignment"""
    try:
        data = request.form
        
        # Validate required fields
        required_fields = ['subject_id', 'title', 'due_date']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required!'}), 400
        
        # Check if subject exists and belongs to teacher
        subject = Subject.query.filter_by(
            id=data['subject_id'],
            teacher_id=current_user.id
        ).first()
        
        if not subject:
            return jsonify({'message': 'Subject not found or access denied!'}), 404
        
        # Parse due date
        try:
            due_date = datetime.fromisoformat(data['due_date'])
        except ValueError:
            return jsonify({'message': 'Invalid due date format!'}), 400
        
        # Create assignment
        assignment = Assignment(
            subject_id=data['subject_id'],
            title=data['title'],
            description=data.get('description', ''),
            due_date=due_date
        )
        
        db.session.add(assignment)
        db.session.commit()
        
        return jsonify({
            'message': 'Assignment created successfully!',
            'assignment': assignment.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@teacher_bp.route('/assignments/<int:subject_id>', methods=['GET'])
@role_required('teacher')
def get_subject_assignments(current_user, subject_id):
    """Get all assignments for a subject"""
    # Verify teacher owns the subject
    subject = Subject.query.filter_by(
        id=subject_id,
        teacher_id=current_user.id
    ).first()
    
    if not subject:
        return jsonify({'message': 'Subject not found or access denied!'}), 404
    
    assignments = Assignment.query.filter_by(subject_id=subject_id).all()
    return jsonify([assignment.to_dict() for assignment in assignments]), 200

@teacher_bp.route('/assignments/<int:assignment_id>/submissions', methods=['GET'])
@role_required('teacher')
def get_assignment_submissions(current_user, assignment_id):
    """Get all submissions for an assignment"""
    assignment = Assignment.query.get_or_404(assignment_id)
    
    # Verify teacher owns the subject
    if assignment.subject.teacher_id != current_user.id:
        return jsonify({'message': 'Access denied!'}), 403
    
    submissions = Submission.query.filter_by(assignment_id=assignment_id).all()
    return jsonify([submission.to_dict() for submission in submissions]), 200

@teacher_bp.route('/submissions/<int:submission_id>/grade', methods=['PUT'])
@role_required('teacher')
def grade_submission(current_user, submission_id):
    """Grade a submission"""
    data = request.get_json()
    
    submission = Submission.query.get_or_404(submission_id)
    
    # Verify teacher owns the assignment
    if submission.assignment.subject.teacher_id != current_user.id:
        return jsonify({'message': 'Access denied!'}), 403
    
    submission.grade = data.get('grade')
    submission.feedback = data.get('feedback')
    
    db.session.commit()
    
    return jsonify({
        'message': 'Submission graded successfully!',
        'submission': submission.to_dict()
    }), 200

# Attendance Management
@teacher_bp.route('/attendance/mark', methods=['POST'])
@role_required('teacher')
def mark_attendance(current_user):
    """Mark attendance for students in a subject"""
    data = request.get_json()
    
    required_fields = ['subject_id', 'date', 'attendance_records']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} is required!'}), 400
    
    # Verify teacher owns the subject
    subject = Subject.query.filter_by(
        id=data['subject_id'],
        teacher_id=current_user.id
    ).first()
    
    if not subject:
        return jsonify({'message': 'Subject not found or access denied!'}), 404
    
    # Parse date
    try:
        attendance_date = datetime.fromisoformat(data['date']).date()
    except ValueError:
        return jsonify({'message': 'Invalid date format!'}), 400
    
    attendance_records = []
    errors = []
    
    for record in data['attendance_records']:
        student_id = record.get('student_id')
        status = record.get('status')
        
        if not student_id or status not in ['PRESENT', 'ABSENT']:
            errors.append(f"Invalid record: {record}")
            continue
        
        # Check if student exists
        student = User.query.filter_by(id=student_id, role='student').first()
        if not student:
            errors.append(f"Student {student_id} not found")
            continue
        
        # Check for existing attendance record
        existing = Attendance.query.filter_by(
            subject_id=data['subject_id'],
            student_id=student_id,
            date=attendance_date
        ).first()
        
        if existing:
            existing.status = status
            attendance_records.append(existing)
        else:
            new_attendance = Attendance(
                subject_id=data['subject_id'],
                student_id=student_id,
                date=attendance_date,
                status=status
            )
            db.session.add(new_attendance)
            attendance_records.append(new_attendance)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Attendance marked successfully!',
        'records_marked': len(attendance_records),
        'errors': errors if errors else None
    }), 201

@teacher_bp.route('/attendance/<int:subject_id>', methods=['GET'])
@role_required('teacher')
def get_subject_attendance(current_user, subject_id):
    """Get attendance records for a subject"""
    # Verify teacher owns the subject
    subject = Subject.query.filter_by(
        id=subject_id,
        teacher_id=current_user.id
    ).first()
    
    if not subject:
        return jsonify({'message': 'Subject not found or access denied!'}), 404
    
    # Get date range from query parameters
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Attendance.query.filter_by(subject_id=subject_id)
    
    if start_date:
        try:
            query = query.filter(Attendance.date >= datetime.fromisoformat(start_date).date())
        except ValueError:
            pass
    
    if end_date:
        try:
            query = query.filter(Attendance.date <= datetime.fromisoformat(end_date).date())
        except ValueError:
            pass
    
    attendance_records = query.order_by(Attendance.date.desc()).all()
    
    # Group by student for easier display
    students_attendance = {}
    for record in attendance_records:
        student_id = record.student_id
        if student_id not in students_attendance:
            students_attendance[student_id] = {
                'student': record.student.to_dict(),
                'records': []
            }
        students_attendance[student_id]['records'].append(record.to_dict())
    
    return jsonify({
        'subject': subject.to_dict(),
        'attendance': list(students_attendance.values())
    }), 200

@teacher_bp.route('/students', methods=['GET'])
@role_required('teacher')
def get_students(current_user):
    """Get all students for teacher to select for attendance"""
    students = User.query.filter_by(role='student', active=True).all()
    return jsonify([student.to_dict() for student in students]), 200