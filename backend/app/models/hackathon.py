from app.extensions import db
from datetime import datetime

class Hackathon(db.Model):
    __tablename__ = 'hackathons'

    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    max_teams = db.Column(db.Integer)
    max_team_members = db.Column(db.Integer)
    status = db.Column(db.String(20), default='open')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    rules = db.relationship("HackathonRule", backref="hackathon", cascade="all, delete-orphan")
    tags = db.relationship("Tag", secondary="hackathon_tags", backref="hackathons")
    creator = db.relationship("User", backref="hackathons_created", foreign_keys=[creator_id])

    

    def to_dict(self):
        return {
            "id": self.id,
            "creator_id": self.creator_id,
            "title": self.title,
            "description": self.description,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "max_teams": self.max_teams,
            "max_team_members": self.max_team_members,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "rules": [rule.to_dict() for rule in self.rules],
            "tags": [tag.to_dict() for tag in self.tags],
            "teams": self.get_teams(),
            "judges": [j.judge.to_dict() for j in self.judgeships],
            "creator": self.creator.to_dict() if self.creator else None,

        }

    def add_rule(self, text):
        self.rules.append(HackathonRule(rule_text=text))

    def get_teams(self):
        return [team.to_dict() for team in self.teams]

    def get_members(self):
        return [member.to_dict() for member in self.team_members]


    def add_tag(self, tag):
        self.tags.append(tag)

class HackathonRule(db.Model):
    __tablename__ = 'hackathon_rules'

    id = db.Column(db.Integer, primary_key=True)
    hackathon_id = db.Column(db.Integer, db.ForeignKey('hackathons.id'), nullable=False)
    rule_text = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "hackathon_id": self.hackathon_id,
            "rule_text": self.rule_text
        }

class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    icon = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "icon":self.icon
        }

class HackathonTag(db.Model):
    __tablename__ = 'hackathon_tags'

    hackathon_id = db.Column(db.Integer, db.ForeignKey('hackathons.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'), primary_key=True)


class HackathonJudge(db.Model):
    __tablename__ = 'hackathon_judges'

    id = db.Column(db.Integer, primary_key=True)
    hackathon_id = db.Column(db.Integer, db.ForeignKey('hackathons.id'), nullable=False)
    judge_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones
    hackathon = db.relationship('Hackathon', backref=db.backref('judgeships', cascade='all, delete-orphan'))
    judge = db.relationship('User', backref=db.backref('judged_hackathons', cascade='all, delete-orphan'))

    def to_dict(self):
        return {
            "id": self.id,
            "hackathon_id": self.hackathon_id,
            "judge_id": self.judge_id,
            "assigned_at": self.assigned_at.isoformat()
        }
