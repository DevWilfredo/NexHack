import os
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from app.models.user import User
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.schemas.user_schema import UserUpdateSchema
from marshmallow import ValidationError

user_bp = Blueprint("users", __name__)

@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    try:
        user_id = get_jwt_identity()
          
        users = User.query.all()
        results = list(map(lambda x: x.to_dict(), users))
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_single_user(user_id):
    try:
        jwt_id = get_jwt_identity()
        if not str(user_id) == jwt_id:
            return jsonify({'error':'You have not the required Permissions'}), 403
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

    
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    schema = UserUpdateSchema()
    try:
        jwt_id = get_jwt_identity()
        if not str(user_id) == jwt_id:
            return jsonify({'error': 'You have not the required Permissions'}), 403

        user = User.query.get_or_404(user_id)
        data = request.form.to_dict()
        data = schema.load(data)

        if 'firstname' in data:
            user.firstname = data['firstname']
        if 'lastname' in data:
            user.lastname = data['lastname']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.set_password(data['password'])
        
        if 'file' in request.files:
            file = request.files['file']
            if file.filename != '' and allowed_file(file.filename):
                if user.profile_picture:
                    old_filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], user.profile_picture)
                    if os.path.exists(old_filepath):
                        os.remove(old_filepath)
                
                ext = file.filename.rsplit('.', 1)[1].lower()
                filename = secure_filename(f"user_{user.id}.{ext}")
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                user.profile_picture = filename

        db.session.commit()
        return jsonify(user.to_dict()), 200

    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@user_bp.route('/profile_pictures/<filename>', methods=['GET'])
def serve_profile_picture(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)