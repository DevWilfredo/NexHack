# team.py
from datetime import datetime
from app.extensions import db
from app.models.user import User  # Asegúrate que se puede importar
from app.models.hackathon import Hackathon

class Team(db.Model):
    __tablename__ = "teams"

    id = db.Column(db.Integer, primary_key=True)
    hackathon_id = db.Column(db.Integer, db.ForeignKey("hackathons.id"), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    github_url = db.Column(db.String(255))
    live_preview_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hackathon = db.relationship("Hackathon", backref=db.backref("teams", cascade="all, delete-orphan"))
    creator = db.relationship("User", backref="created_teams")
    members = db.relationship("TeamMember", backref="team", cascade="all, delete-orphan")
    requests = db.relationship("TeamRequest", backref="team", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "hackathon_id": self.hackathon_id,
            "creator_id": self.creator_id,
            "name": self.name,
            "github_url": self.github_url,
            "live_preview_url": self.live_preview_url,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "members": [member.to_dict() for member in self.members]
        }

class TeamMember(db.Model):
    __tablename__ = "team_members"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    hackathon_id = db.Column(db.Integer, db.ForeignKey("hackathons.id"), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="team_memberships")
    hackathon = db.relationship("Hackathon", backref="team_members")

    __table_args__ = (db.UniqueConstraint("user_id", "hackathon_id", name="_user_hackathon_unique"),)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "team_id": self.team_id,
            "hackathon_id": self.hackathon_id,
            "joined_at": self.joined_at.isoformat(),
            
        }

class TeamRequest(db.Model):
    __tablename__ = "team_requests"

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    requested_by_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'invitation' o 'application'
    status = db.Column(db.String(20), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", foreign_keys=[user_id], backref="team_requests_received")
    requested_by = db.relationship("User", foreign_keys=[requested_by_id], backref="team_requests_sent")

    def to_dict(self):
        return {
            "id": self.id,
            "team_id": self.team_id,
            "user_id": self.user_id,
            "requested_by_id": self.requested_by_id,
            "type": self.type,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
