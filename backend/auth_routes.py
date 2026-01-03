from flask import Blueprint, request, jsonify, current_app
from models import db, User
from auth import generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    required_fields = ['email', 'password', 'role']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} is required!'}), 400

    if data['role'] not in ['teacher', 'student']:
        return jsonify({'message': 'Role must be teacher or student!'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered!'}), 400

    new_user = User(
        email=data['email'],
        role=data['role']
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()

    token = generate_token(new_user.id)
    
    return jsonify({
        'message': 'User registered successfully!',
        'token': token,
        'user': new_user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return token"""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password required!'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid email or password!'}), 401
    
    if not user.active:
        return jsonify({'message': 'Account is deactivated!'}), 401
    
    token = generate_token(user.id)
    
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current user info (requires token)"""
    from auth import token_required
    
    @token_required
    def protected_route(current_user):
        return jsonify({'user': current_user.to_dict()}), 200
    
    return protected_route()