from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.hackathon import Hackathon, HackathonRule, Tag, HackathonJudge
from app.models.user import User
from app.models.team import Team, TeamMember
from app.models.evaluation import TeamScore, HackathonWinner
from app.schemas.hackathon_schema import HackathonCreateSchema, HackathonUpdateSchema
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from app.utils.notifications import create_notification

hackathon_bp = Blueprint('hackathons', __name__)

@hackathon_bp.route('/', methods=['GET'])
def get_hackatons():
    try:
        hackatons = Hackathon.query.all()
        results = list(map(lambda x: x.to_dict(), hackatons))
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'erorr': str(e)}), 500

@hackathon_bp.route('', methods=['POST'])
@jwt_required()
def create_hackathon():
    schema = HackathonCreateSchema()
    try:
        json_data = request.get_json()
        print("JSON recibido: ", json_data)
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
        print("Error de validación",err.messages)
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
            return jsonify({'error': 'No tienes permisos suficientes.'}), 403

        hackathon = Hackathon.query.get_or_404(hackathon_id)

        # ⚠️ Solo permitir modificar campos permitidos
        hackathon.title = data.get("title", hackathon.title)
        hackathon.description = data.get("description", hackathon.description)
        hackathon.start_date = data.get("start_date", hackathon.start_date)
        hackathon.end_date = data.get("end_date", hackathon.end_date)

        # 🛑 Validar cambio de estado
        new_status = data.get("status", hackathon.status)
        current_teams_count = len(hackathon.teams)

        if new_status != hackathon.status:
            if new_status == "open":
                if current_teams_count >= hackathon.max_teams:
                    return jsonify({"error": "No se puede cambiar a 'open', el número máximo de equipos ya fue alcanzado."}), 400
            elif new_status not in ["pending", "cancelled", "finalized"]:
                return jsonify({"error": "Estado no permitido. Solo se puede cambiar a 'pending', 'cancelled' o 'finalized'."}), 400

            hackathon.status = new_status

        # ✅ Actualizar reglas si vienen
        if "rules" in data:
            hackathon.rules.clear()
            for rule_text in data["rules"]:
                hackathon.add_rule(rule_text)

        # ✅ Actualizar tags si vienen
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
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@hackathon_bp.route('/<int:hackathon_id>', methods=['GET'])
def get_single_hackathon(hackathon_id):
    try:
        requested_hackathon = Hackathon.query.get_or_404(hackathon_id)
        return jsonify(requested_hackathon.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@hackathon_bp.route('/add/<int:hackathon_id>/judges', methods=['POST'])
@jwt_required()
def add_hackathons_judges(hackathon_id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    hackathon = Hackathon.query.get_or_404(hackathon_id)

    # ✅ Permitir si es moderador o creador del hackathon
    if user.role != 'moderator' and user.id != hackathon.creator_id:
        return jsonify({'error': 'No tienes permisos para agregar jueces a este hackathon.'}), 403

    data = request.get_json()
    judge_id = data.get('judge_id')

    if not judge_id:
        return jsonify({'error': 'Missing judge_id'}), 400

    judge = User.query.get(judge_id)
    if not judge:
        return jsonify({'error': 'Usuario no encontrado como juez'}), 404

    existing_judge = HackathonJudge.query.filter_by(
        hackathon_id=hackathon_id,
        judge_id=judge_id
    ).first()

    if existing_judge:
        return jsonify({'message': 'Este usuario ya es juez en este hackathon'}), 200

    try:
        new_judge = HackathonJudge(hackathon_id=hackathon_id, judge_id=judge_id)
        db.session.add(new_judge)

        # 🔔 Notificar al juez agregado
        create_notification(
            user_id=judge.id,
            notif_type="assigned_judge",
            message=f"Has sido asignado como juez en el hackathon '{hackathon.title}'.",
            data={
                "hackathon_id": hackathon.id,
                "hackathon_title": hackathon.title,
                "added_by": {
                    "id": user.id,
                    "firstname": user.firstname,
                    "lastname": user.lastname,
                    "profile_picture": user.profile_picture
                }
            }
        )

        db.session.commit()
        return jsonify({'message': 'Juez agregado exitosamente', 'judge': new_judge.to_dict()}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500

@hackathon_bp.route('/evaluate', methods=['POST'])
@jwt_required()
def evaluate_team():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    data = request.get_json()
    team_id = data.get('team_id')
    hackathon_id = data.get('hackathon_id')
    score = data.get('score')
    feedback = data.get('feedback', None)

    # Validaciones básicas
    if not all([team_id, hackathon_id, score is not None]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Verifica que el equipo y hackathon existan
    team = Team.query.get(team_id)
    hackathon = Hackathon.query.get(hackathon_id)
    if not team or not hackathon:
        return jsonify({'error': 'Team or Hackathon not found'}), 404

    # Verifica que el usuario sea juez de ese hackathon
    is_judge = HackathonJudge.query.filter_by(
        hackathon_id=hackathon_id, judge_id=user_id
    ).first()
    if not is_judge:
        return jsonify({'error': 'No eres un juez de este hackathon'}), 403

    # Verifica que el juez no haya evaluado ya este equipo
    existing_score = TeamScore.query.filter_by(
        team_id=team_id,
        judge_id=user_id,
        hackathon_id=hackathon_id
    ).first()

    if existing_score:
        return jsonify({'error': 'Ya has evaluado este equipo'}), 400

    try:
        new_score = TeamScore(
            team_id=team_id,
            judge_id=user_id,
            hackathon_id=hackathon_id,
            score=score,
            feedback=feedback
        )
        db.session.add(new_score)

        # 🔔 Notificar a cada miembro del equipo que su equipo fue evaluado
        team_members = TeamMember.query.filter_by(team_id=team_id).all()
        for member in team_members:
            create_notification(
                user_id=member.user_id,
                notif_type="team_evaluated",
                message=f"Tu equipo '{team.name}' fue evaluado por el juez {user.firstname} {user.lastname}.",
                data={
                    "team_id": team.id,
                    "team_name": team.name,
                    "hackathon_id": hackathon.id,
                    "score": score,
                    "feedback": feedback,
                    "judge": {
                        "id": user.id,
                        "firstname": user.firstname,
                        "lastname": user.lastname,
                        "profile_picture": user.profile_picture
                    }
                }
            )

        db.session.commit()

        return jsonify({'message': 'Evaluation submitted successfully', 'evaluation': new_score.to_dict()}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500
    
@hackathon_bp.route('/<int:hackathon_id>/finalize', methods=['POST'])
@jwt_required()
def finalize_hackathon(hackathon_id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    hackathon = Hackathon.query.get_or_404(hackathon_id)

    # ✅ Permitir si es moderador o creador
    if user.role != 'moderator' and user.id != hackathon.creator_id:
        return jsonify({'error': 'No tienes permisos para finalizar este hackathon.'}), 403
    
    if hackathon.status == "finished":
        return jsonify({'message': 'Hackathon already finalized'}), 400

    try:

        # Obtener promedio de puntuación por equipo
        avg_scores = db.session.query(
            TeamScore.team_id,
            func.avg(TeamScore.score).label("avg_score")
        ).filter_by(hackathon_id=hackathon_id).group_by(TeamScore.team_id).order_by(
            func.avg(TeamScore.score).desc()
        ).all()

        position_points = {1: 100, 2: 50, 3: 25}
        winners = []

        for index, (team_id, avg_score) in enumerate(avg_scores, start=1):
            points_awarded = position_points.get(index, 0)

            winner = HackathonWinner(
                hackathon_id=hackathon_id,
                team_id=team_id,
                position=index,
                points_awarded=points_awarded
            )
            db.session.add(winner)
            winners.append(winner)

            # Sumar puntos a los miembros solo si el equipo está en el Top 3
            if points_awarded > 0:
                members = TeamMember.query.filter_by(team_id=team_id).all()
                for member in members:
                    member_user = User.query.get(member.user_id)
                    member_user.points += points_awarded

        # Equipos que no recibieron ninguna evaluación
        scored_team_ids = [team_id for team_id, _ in avg_scores]
        all_teams = Team.query.filter_by(hackathon_id=hackathon_id).all()
        remaining_teams = [team for team in all_teams if team.id not in scored_team_ids]

        last_position = len(avg_scores)
        for team in remaining_teams:
            last_position += 1
            winner = HackathonWinner(
                hackathon_id=hackathon_id,
                team_id=team.id,
                position=last_position,
                points_awarded=0
            )
            db.session.add(winner)

        # 🔔 Notificar a todos los miembros de cada equipo que el hackathon terminó
        for team in all_teams:
            members = TeamMember.query.filter_by(team_id=team.id).all()
            for member in members:
                create_notification(
                    user_id=member.user_id,
                    notif_type="hackathon_finished",
                    message=f"El hackathon '{hackathon.title}' ha finalizado. Gracias por participar.",
                    data={
                        "hackathon_id": hackathon.id,
                        "hackathon_name": hackathon.title,
                        "team_id": team.id,
                        "team_name": team.name
                    }
                )

        # Marcar hackathon como finalizado
        hackathon.status = "finished"
        db.session.commit()

        return jsonify({
            "message": "Hackathon finalized, winners saved, and points awarded",
            "winners": [w.to_dict() for w in HackathonWinner.query.filter_by(hackathon_id=hackathon_id).order_by(HackathonWinner.position).all()]
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


#--- conseguir todos los winners de hackathon---#
@hackathon_bp.route('/winners', methods=['GET'])
@jwt_required()    
def get_hackathon_winners():
    try:
        winners = HackathonWinner.query.all()
        return jsonify([w.to_dict() for w in winners]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500