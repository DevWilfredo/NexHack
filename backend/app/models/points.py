# points.py
from datetime import datetime
from app.extensions import db

class UserHackathonPoints(db.Model):
    __tablename__ = 'user_hackathon_points'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    hackathon_id = db.Column(db.Integer, db.ForeignKey('hackathons.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    position = db.Column(db.Integer)
    points = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'hackathon_id', name='_user_hackathon_points_unique'),)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "hackathon_id": self.hackathon_id,
            "team_id": self.team_id,
            "position": self.position,
            "points": self.points,
            "created_at": self.created_at.isoformat()
        }
