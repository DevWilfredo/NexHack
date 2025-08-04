from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from app.models.notification import Notification
from app.models.user import User
from app.extensions import db


notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/v1')

@notifications_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    current_user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=current_user_id).all()
    return jsonify([n.to_dict() for n in notifications]), 200

@notifications_bp.route('/notifications/<int:notification_id>/read', methods=['PUT', 'OPTIONS'])
@jwt_required()
def mark_as_read(notification_id):
    current_user_id = get_jwt_identity()
    notification = Notification.query.filter_by(id=notification_id, user_id=current_user_id).first()

    if not notification:
        return jsonify({"msg": "Notificación no encontrada"}), 404

    notification.read = True
    db.session.commit()
    return jsonify({"msg": "Notificación marcada como leída"}), 200
