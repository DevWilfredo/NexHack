from flask import Blueprint, request, jsonify
from app.models.user import User
from app.extensions import db
from flask_jwt_extended import create_access_token
from app.schemas.user_schema import UserLoginSchema, UserRegisterSchema
from marshmallow import ValidationError

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/register', methods=['POST'])
def create_user():
    schema = UserRegisterSchema()
    try:
        data = schema.load(request.get_json())
        existing_user  =  User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error':'email already registered'}), 409
        user = User(firstname=data['firstname'], lastname=data['lastname'], email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@auth_bp.route('/login', methods=['POST'])
def login_user():
    schema = UserLoginSchema()
    try:
        data = schema.load(request.get_json())
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return jsonify({'error': '1 or more credentials are missing'}), 401
        matching_user = User.query.filter_by(email=email).first()
        if not matching_user or not matching_user.check_password(password):
            return jsonify({'error': 'Invalid Credentials'}), 401
        access_token = create_access_token(identity=str(matching_user.id))
        return jsonify({'token': access_token, 'user': matching_user.to_dict()})
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500