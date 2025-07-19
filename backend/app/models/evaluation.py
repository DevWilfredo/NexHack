# evaluation.py
from datetime import datetime
from app.extensions import db

class VotingCriteria(db.Model):
    __tablename__ = 'voting_criteria'

    id = db.Column(db.Integer, primary_key=True)
    hackathon_id = db.Column(db.Integer, db.ForeignKey('hackathons.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    weight = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "hackathon_id": self.hackathon_id,
            "name": self.name,
            "weight": self.weight
        }

class TeamEvaluation(db.Model):
    __tablename__ = 'team_evaluations'

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    judge_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    hackathon_id = db.Column(db.Integer, db.ForeignKey('hackathons.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('team_id', 'judge_id', name='_team_judge_unique'),)

    scores = db.relationship("TeamScore", backref="evaluation", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "team_id": self.team_id,
            "judge_id": self.judge_id,
            "hackathon_id": self.hackathon_id,
            "created_at": self.created_at.isoformat(),
            "scores": [score.to_dict() for score in self.scores]
        }


class TeamScore(db.Model):
    __tablename__ = "team_scores"

    id = db.Column(db.Integer, primary_key=True)
    evaluation_id = db.Column(db.Integer, db.ForeignKey("team_evaluations.id"), nullable=False)
    criteria_id = db.Column(db.Integer, db.ForeignKey("voting_criteria.id"), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.Text)

    criteria = db.relationship("VotingCriteria")

    def to_dict(self):
        return {
            "criteria": self.criteria.name,
            "score": self.score,
            "feedback": self.feedback
        }


