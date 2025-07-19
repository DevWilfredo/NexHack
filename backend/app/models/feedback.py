# feedback.py
from datetime import datetime
from app.extensions import db

class UserTeamLike(db.Model):
    __tablename__ = 'user_team_likes'

    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    hackathon_id = db.Column(db.Integer, db.ForeignKey('hackathons.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('from_user_id', 'to_user_id', 'hackathon_id', name='_user_like_unique'),)

    def to_dict(self):
        return {
            "id": self.id,
            "from_user_id": self.from_user_id,
            "to_user_id": self.to_user_id,
            "hackathon_id": self.hackathon_id,
            "team_id": self.team_id,
            "created_at": self.created_at.isoformat()
        }

class UserTestimonial(db.Model):
    __tablename__ = 'user_testimonials'

    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    hackathon_id = db.Column(db.Integer, db.ForeignKey('hackathons.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('from_user_id', 'to_user_id', 'hackathon_id', name='_testimonial_unique'),)

    def to_dict(self):
        return {
            "id": self.id,
            "from_user_id": self.from_user_id,
            "to_user_id": self.to_user_id,
            "hackathon_id": self.hackathon_id,
            "team_id": self.team_id,
            "message": self.message,
            "created_at": self.created_at.isoformat()
        }
