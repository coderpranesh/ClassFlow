import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from auth_routes import auth_bp
from teacher_routes import teacher_bp
from student_routes import student_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app, supports_credentials=True)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(teacher_bp, url_prefix='/api')
    app.register_blueprint(student_bp, url_prefix='/api')

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'message': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'message': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, port=5000)