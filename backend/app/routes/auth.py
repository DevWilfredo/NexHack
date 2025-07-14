from flask import Blueprint, request, jsonify
from app.models.user import User
from app.extensions import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/register', methods=['POST'])
def create_user():
    try:
        if not request.get_json():
            return jsonify({'error': 'No data provided'}), 400
        data = request.get_json()
        existing_user  =  User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error':'email already registered'}), 409
        user = User(firstname=data['firstname'], lastname=data['lastname'], email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500