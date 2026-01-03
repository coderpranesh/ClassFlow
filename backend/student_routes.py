import os
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app, send_file
from werkzeug.utils import secure_filename
from models import db, Subject, Assignment, Submission, Attendance, User
from auth import token_required, role_required

student_bp = Blueprint('student', __name__)

@student_bp.route('/subjects', methods=['GET'])
@role_required('student')
def get_student_subjects(current_user):
    """Get all subjects (students can view all subjects)"""
    subjects = Subject.query.all()
    return jsonify([subject.to_dict() for subject in subjects]), 200

@student_bp.route('/assignments/<int:subject_id>', methods=['GET'])
@role_required('student')
def get_subject_assignments_student(current_user, subject_id):
    """Get assignments for a subject (student view)"""
    assignments = Assignment.query.filter_by(subject_id=subject_id).all()
    
    # Check if student has submitted each assignment
    assignments_data = []
    for assignment in assignments:
        assignment_data = assignment.to_dict()
        submission = Submission.query.filter_by(
            assignment_id=assignment.id,
            student_id=current_user.id
        ).first()
        
        assignment_data['submitted'] = submission is not None
        assignment_data['my_submission'] = submission.to_dict() if submission else None
        assignments_data.append(assignment_data)
    
    return jsonify(assignments_data), 200

@student_bp.route('/submissions', methods=['POST'])
@role_required('student')
def submit_assignment(current_user):
    """Submit an assignment"""
    try:
        # Check if file is included
        if 'file' not in request.files:
            return jsonify({'message': 'No file provided!'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'message': 'No file selected!'}), 400
        
        # Get assignment_id from form data
        assignment_id = request.form.get('assignment_id')
        if not assignment_id:
            return jsonify({'message': 'Assignment ID is required!'}), 400
        
        # Check if assignment exists
        assignment = Assignment.query.get(assignment_id)
        if not assignment:
            return jsonify({'message': 'Assignment not found!'}), 404
        
        # Check if student has already submitted
        existing_submission = Submission.query.filter_by(
            assignment_id=assignment_id,
            student_id=current_user.id
        ).first()
        
        if existing_submission:
            return jsonify({'message': 'You have already submitted this assignment!'}), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({
                'message': f'File type not allowed! Allowed types: {", ".join(current_app.config["ALLOWED_EXTENSIONS"])}'
            }), 400
        
        # Secure filename and save
        filename = secure_filename(file.filename)
        unique_filename = f"{current_user.id}_{assignment_id}_{datetime.utcnow().timestamp()}_{filename}"
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
        
        file.save(filepath)
        
        # Create submission record
        submission = Submission(
            assignment_id=assignment_id,
            student_id=current_user.id,
            file_path=filepath
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'message': 'Assignment submitted successfully!',
            'submission': submission.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@student_bp.route('/my-submissions', methods=['GET'])
@role_required('student')
def get_my_submissions(current_user):
    """Get all submissions by current student"""
    submissions = Submission.query.filter_by(student_id=current_user.id)\
        .join(Assignment)\
        .order_by(Submission.submitted_at.desc())\
        .all()
    
    return jsonify([submission.to_dict() for submission in submissions]), 200

@student_bp.route('/my-attendance', methods=['GET'])
@role_required('student')
def get_my_attendance(current_user):
    """Get attendance records for current student"""
    subject_id = request.args.get('subject_id')
    
    query = Attendance.query.filter_by(student_id=current_user.id)
    
    if subject_id:
        query = query.filter_by(subject_id=subject_id)
    
    attendance_records = query.order_by(Attendance.date.desc()).all()
    
    # Calculate attendance statistics
    if subject_id:
        total = len(attendance_records)
        present = len([r for r in attendance_records if r.status == 'PRESENT'])
        attendance_percentage = (present / total * 100) if total > 0 else 0
        
        stats = {
            'total': total,
            'present': present,
            'absent': total - present,
            'percentage': round(attendance_percentage, 2)
        }
    else:
        stats = None
    
    return jsonify({
        'attendance': [record.to_dict() for record in attendance_records],
        'stats': stats
    }), 200

@student_bp.route('/download/<int:submission_id>', methods=['GET'])
@role_required('student')
def download_submission(current_user, submission_id):
    """Download a submission file"""
    submission = Submission.query.get_or_404(submission_id)
    
    # Check if student owns the submission
    if submission.student_id != current_user.id:
        # Check if teacher owns the assignment
        if current_user.role == 'teacher' and submission.assignment.subject.teacher_id == current_user.id:
            pass  # Teacher can download
        else:
            return jsonify({'message': 'Access denied!'}), 403
    
    if not os.path.exists(submission.file_path):
        return jsonify({'message': 'File not found!'}), 404
    
    filename = submission.file_path.split('/')[-1]
    return send_file(
        submission.file_path,
        as_attachment=True,
        download_name=filename
    )

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']