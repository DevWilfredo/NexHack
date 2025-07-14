from flask import Blueprint, request, jsonify
from app.models.user import User
from app.extensions import db
from flask_jwt_extended import create_access_token

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
    
@auth_bp.route('/login', methods=['POST'])
def login_user():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        if not email or not password:
            return jsonify({'error': '1 or more credentials are missing'}), 401
        matching_user = User.query.filter_by(email=email).first()
        if not matching_user:
            return jsonify({'error': 'Invalid Credentials'}),  401
        if not matching_user.check_password(password):
            return jsonify({'error': 'Invalid Credentials'}),  401
        access_token = create_access_token(identity=str(matching_user.id))
        return jsonify({'token':access_token, 'user':matching_user.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500