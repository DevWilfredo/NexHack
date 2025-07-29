from flask import Blueprint, request, jsonify
from app.models.user import User, LoginAttempt
from app.extensions import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.schemas.user_schema import UserLoginSchema, UserRegisterSchema
from marshmallow import ValidationError
from datetime import datetime, timedelta

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

        time_limit = datetime.utcnow() - timedelta(minutes=15)
        recent_failures = LoginAttempt.query.filter_by(email=email, success=False)\
            .filter(LoginAttempt.timestamp >= time_limit).count()

        if recent_failures >= 3:
            return jsonify({'error': 'Too many failed attempts. Try again in 15 minutes.'}), 403

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            # Registrar intento fallido
            attempt = LoginAttempt(email=email, success=False)
            db.session.add(attempt)
            db.session.commit()
            return jsonify({'error': 'Invalid Credentials'}), 401

        # Login correcto → registrar intento exitoso
        attempt = LoginAttempt(email=email, success=True)
        db.session.add(attempt)
        db.session.commit()

        access_token = create_access_token(identity=str(user.id))
        return jsonify({'token': access_token, 'user_id': user.id})

    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@auth_bp.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'user': user.to_dict()
    }), 200