from datetime import datetime
from app.extensions import db

class TeamScore(db.Model):
    __tablename__ = "team_scores"

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    judge_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    hackathon_id = db.Column(db.Integer, db.ForeignKey("hackathons.id"), nullable=False)
    score = db.Column(db.Float, nullable=False)
    feedback = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('team_id', 'judge_id', 'hackathon_id', name='_team_judge_hackathon_uc'),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "team_id": self.team_id,
            "judge_id": self.judge_id,
            "hackathon_id": self.hackathon_id,
            "score": self.score,
            "feedback": self.feedback,
            "created_at": self.created_at.isoformat(),
        }

class HackathonWinner(db.Model):
    __tablename__ = "hackathon_winners"

    id = db.Column(db.Integer, primary_key=True)
    hackathon_id = db.Column(db.Integer, db.ForeignKey("hackathons.id"), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    position = db.Column(db.Integer, nullable=False)
    points_awarded = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('hackathon_id', 'team_id', name='_unique_winner_per_hackathon'),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "hackathon_id": self.hackathon_id,
            "team_id": self.team_id,
            "position": self.position,
            "points_awarded": self.points_awarded,
            "created_at": self.created_at.isoformat(),
        }
