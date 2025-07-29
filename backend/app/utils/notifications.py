from app.models.notification import Notification
from app.extensions import db

def create_notification(user_id, notif_type, message, data=None):
    notification = Notification(
        user_id=user_id,
        type=notif_type,
        message=message,
        data=data or {},
        read=False
    )
    db.session.add(notification)
