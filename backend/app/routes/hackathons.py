# app/routes/hackathons.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.hackathon import Hackathon, HackathonRule, Tag
from app.models.user import User
from app.schemas.hackathon_schema import HackathonCreateSchema, HackathonUpdateSchema
from marshmallow import ValidationError

hackathon_bp = Blueprint('hackathons', __name__)


@hackathon_bp.route('/', methods=['GET'])

def get_hackatons():
    try:
        hackatons = Hackathon.query.all()
        results = list(map(lambda x: x.to_dict(), hackatons))
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'erorr': str(e)}), 500

@hackathon_bp.route('/', methods=['POST'])
@jwt_required()
def create_hackathon():
    schema = HackathonCreateSchema()
    try:
        json_data = request.get_json()
        if not json_data:
            return jsonify({"error": "No input data provided"}), 400

        data = schema.load(json_data)

        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        if not user.isModerator():
            return jsonify({'error': 'You have not the required permissions'}), 403

        hackathon = Hackathon(
            creator_id=user_id,
            title=data["title"],
            description=data.get("description"),
            start_date=data.get("start_date"),
            end_date=data.get("end_date"),
            max_teams=data.get("max_teams"),
            max_team_members=data.get("max_team_members"),
        )

        for rule_text in data.get("rules", []):
            hackathon.add_rule(rule_text)

        for tag_name in data.get("tags", []):
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            hackathon.add_tag(tag)

        db.session.add(hackathon)
        db.session.commit()

        return jsonify(hackathon.to_dict()), 201

    except ValidationError as err:
        return jsonify(err.messages), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@hackathon_bp.route('/<int:hackathon_id>', methods=['PUT'])
@jwt_required()
def update_hackathon(hackathon_id):
    schema = HackathonUpdateSchema()
    try:
        json_data = request.get_json()
        if not json_data:
            return jsonify({"error": "No input data provided"}), 400

        data = schema.load(json_data)

        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.isModerator():
            return jsonify({'error': 'You have not the required permissions'}), 403

        hackathon = Hackathon.query.get_or_404(hackathon_id)
        hackathon.title = data.get("title", hackathon.title)
        hackathon.description = data.get("description", hackathon.description)
        hackathon.start_date = data.get("start_date", hackathon.start_date)
        hackathon.end_date = data.get("end_date", hackathon.end_date)
        hackathon.max_teams = data.get("max_teams", hackathon.max_teams)
        hackathon.max_team_members = data.get("max_team_members", hackathon.max_team_members)
        hackathon.status = data.get("status", hackathon.status)

        if "rules" in data:
            hackathon.rules.clear()
            for rule_text in data["rules"]:
                hackathon.add_rule(rule_text)

        if "tags" in data:
            hackathon.tags.clear()
            for tag_name in data["tags"]:
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    db.session.add(tag)
                hackathon.add_tag(tag)

        db.session.commit()

        return jsonify(hackathon.to_dict()), 200

    except ValidationError as err:
        return jsonify(err.messages), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
