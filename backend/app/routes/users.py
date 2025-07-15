from flask import Blueprint, request, jsonify
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
        requesting_user = User.query.get_or_404(user_id)
        if not requesting_user.isModerator():
            return jsonify({'error':'You have not the required Permissions'}), 403
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
    
@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    schema = UserUpdateSchema()
    try:
        jwt_id = get_jwt_identity()
        if not str(user_id) == jwt_id:
            return jsonify({'error':'You have not the required Permissions'}), 403
        user = User.query.get_or_404(user_id)
        data = schema.load(request.get_json())
        if 'firstname' in data:
            user.firstname = data['firstname']
        if 'lastname' in data:
            user.lastname = data['lastname']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.set_password(data['password'])
        db.session.commit()
        return jsonify(user.to_dict()), 200
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


