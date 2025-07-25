from datetime import datetime
from app.extensions import db, bcrypt

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    role = db.Column(db.String(50), default="user")
    profile_picture = db.Column(db.String(255), nullable=True)
    github_url = db.Column(db.String(255), nullable=True)
    website_url = db.Column(db.String(255), nullable=True)
    linkedin_url = db.Column(db.String(255), nullable=True)
    points = db.Column(db.Integer, default=0)  # 🔥 Campo nuevo
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def isModerator(self):
        return self.role == 'moderator'

    def to_dict(self):
        return {
            "id": self.id,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email,
            "bio": self.bio,
            "role": self.role,
            "profile_picture": self.profile_picture,
            "github_url": self.github_url,
            "linkedin_url": self.linkedin_url,
            "website_url": self.website_url,
            "points": self.points, 
            "notifications": [notification.to_dict() for notification in self.notifications]
        }
    def add_points(self, points):
        self.points += points
        self.updated_at = datetime.utcnow()
