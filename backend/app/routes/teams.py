from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.team import Team,TeamMember,TeamRequest
from app.models.user import User
from app.models.hackathon import Hackathon, HackathonJudge
from app.utils.notifications import create_notification
from app.models.evaluation import TeamScore
team_bp = Blueprint('teams', __name__)

@team_bp.route('/<int:hackathon_id>', methods=['POST'])
@jwt_required()
def create_hackathon_team(hackathon_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        name = data.get('name')
        if not name:
            return jsonify({'error': 'El nombre del equipo es requerido'}), 400

        # Verificar si el usuario ya pertenece a un equipo en este hackathon
        existing_membership = TeamMember.query.filter_by(user_id=user_id, hackathon_id=hackathon_id).first()
        if existing_membership:
            return jsonify({'error': 'Ya eres miembro de un equipo en este hackathon y no puedes crear otro.'}), 400

        team = Team(
            hackathon_id=hackathon_id,
            creator_id=user_id,
            name=name,
            bio=data.get('bio', ''),
            github_url=data.get('github_url', ''),
            live_preview_url=data.get('live_preview_url', ''),
        )
        db.session.add(team)
        db.session.flush()
        team_member = TeamMember(
            user_id=user_id,
            team_id=team.id,
            hackathon_id=hackathon_id
        )
        db.session.add(team_member)

        hackathon = Hackathon.query.get(hackathon_id)
        if hackathon:
            hackathon_creator_id = hackathon.creator_id
            user = User.query.get(user_id)

            message = f"{user.firstname} {user.lastname} creó el equipo '{team.name}' en tu hackathon."

            create_notification(
                user_id=hackathon_creator_id,
                notif_type="team_created_in_hackathon",
                message=message,
                data={
                    "team_id": team.id,
                    "team_name": team.name,
                    "hackathon_id": hackathon_id,
                    "creator": {
                        "id": user.id,
                        "firstname": user.firstname,
                        "lastname": user.lastname,
                        "profile_picture": user.profile_picture,
                        "bio": user.bio
                    }
                })
        db.session.commit()
        return jsonify(team.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
# --- Solicitar unirse a un equipo (application) ---
@team_bp.route('/<int:team_id>/request', methods=['POST'])
@jwt_required()
def request_to_join_team(team_id):
    try:
        user_id = get_jwt_identity()
        team = Team.query.get_or_404(team_id)
        hackathon_id = team.hackathon_id

        existing_member = TeamMember.query.filter_by(user_id=user_id, hackathon_id=hackathon_id).first()
        if existing_member:
            return jsonify({'error': 'Ya eres miembro de un equipo en este hackathon.'}), 400

        existing_request = TeamRequest.query.filter_by(user_id=user_id, team_id=team_id, status='pending').first()
        if existing_request:
            return jsonify({'error': 'Ya tienes una solicitud pendiente para este equipo.'}), 400

        team_request = TeamRequest(
            team_id=team_id,
            user_id=team.creator_id,
            requested_by_id=user_id,
            type='application',
            status='pending'
        )
        db.session.add(team_request)

        # 🔔 Notificar al líder del equipo
        user = User.query.get(user_id)
        message = f"{user.firstname} {user.lastname} quiere unirse a tu equipo '{team.name}'."

        create_notification(
            user_id=team.creator_id,
            notif_type="team_join_request",
            message=message,
            data={
                "team_id": team.id,
                "team_name": team.name,
                "from_user": {
                    "id": user.id,
                    "firstname": user.firstname,
                    "lastname": user.lastname,
                    "profile_picture": user.profile_picture,
                    "bio": user.bio
                }
            }
        )

        db.session.commit()
        return jsonify({'message': 'Solicitud enviada correctamente.', 'request': team_request.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@team_bp.route('/<int:team_id>/invite', methods=['POST'])
@jwt_required()
def invite_user_to_team(team_id):
    try:
        creator_id = get_jwt_identity()
        team = Team.query.get_or_404(team_id)
        hackathon_id = team.hackathon_id
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400

        if team.creator_id != int(creator_id):
            return jsonify({'error': 'Solo el creador del equipo puede invitar usuarios.'}), 403

        existing_member = TeamMember.query.filter_by(user_id=user_id, hackathon_id=hackathon_id).first()
        if existing_member:
            return jsonify({'error': 'El usuario ya es miembro de un equipo en este hackathon.'}), 400

        existing_invite = TeamRequest.query.filter_by(user_id=user_id, team_id=team_id, type='invitation', status='pending').first()
        if existing_invite:
            return jsonify({'error': 'Ya existe una invitación pendiente para este usuario.'}), 400

        team_request = TeamRequest(
            team_id=team_id,
            user_id=user_id,
            requested_by_id=creator_id,
            type='invitation',
            status='pending'
        )
        db.session.add(team_request)

        # 🔔 Notificar al usuario invitado
        creator = User.query.get(creator_id)
        message = f"{creator.firstname} te ha invitado a unirte a su equipo '{team.name}'."

        create_notification(
            user_id=user_id,
            notif_type="team_invitation",
            message=message,
            data={
                "team_id": team.id,
                "team_name": team.name,
                "from_user": {
                    "id": creator.id,
                    "firstname": creator.firstname,
                    "lastname": creator.lastname,
                    "profile_picture": creator.profile_picture,
                    "bio": creator.bio
                }
            }
        )

        db.session.commit()
        return jsonify({'message': 'Invitación enviada correctamente.', 'request': team_request.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@team_bp.route('/requests/<int:request_id>', methods=['PATCH'])
@jwt_required()
def handle_team_request(request_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        action = data.get('action')  # 'accept' o 'reject'
        if action not in ['accept', 'reject']:
            return jsonify({'error': 'Acción inválida.'}), 400

        team_request = TeamRequest.query.get_or_404(request_id)
        team = Team.query.get_or_404(team_request.team_id)
        hackathon = Hackathon.query.get_or_404(team.hackathon_id)

        # Determinar quién es el usuario objetivo según tipo de solicitud
        if team_request.type == "invitation":
            target_user_id = team_request.user_id
        else:  # application
            target_user_id = team_request.requested_by_id

        # ❗ Validaciones para jueces
        if team_request.type == 'invitation':
            is_invited_user_judge = HackathonJudge.query.filter_by(
                hackathon_id=hackathon.id,
                judge_id=team_request.user_id
            ).first()
            if is_invited_user_judge and action == 'accept':
                return jsonify({'error': 'Los jueces no pueden aceptar invitaciones a equipos.'}), 403

        if team_request.type == 'application':
            is_applicant_judge = HackathonJudge.query.filter_by(
                hackathon_id=hackathon.id,
                judge_id=team_request.requested_by_id
            ).first()
            if is_applicant_judge and action == 'accept':
                return jsonify({'error': 'Los jueces no pueden unirse a equipos.'}), 403

        # Validaciones de permisos
        if team_request.type == 'application':
            if action == 'reject':
                if team_request.requested_by_id != int(user_id) and team.creator_id != int(user_id):
                    return jsonify({'error': 'Solo el creador del equipo o el solicitante pueden rechazar la solicitud.'}), 403
            else:  # accept
                if team.creator_id != int(user_id):
                    return jsonify({'error': 'Solo el creador del equipo puede aceptar esta solicitud.'}), 403
        elif team_request.type == 'invitation':
            if team_request.user_id != int(user_id):
                return jsonify({'error': 'Solo el usuario invitado puede gestionar esta invitación.'}), 403

        if team_request.status != 'pending':
            return jsonify({'error': 'Esta solicitud ya fue gestionada.'}), 400

        # 👉 RECHAZAR solicitud o invitación
        if action == 'reject':
            team_request.status = 'rejected'

            # 🔔 Notificación de rechazo
            if team_request.type == 'application':
                notified_user_id = team_request.requested_by_id
                actor = User.query.get(user_id)
                message = f"{actor.firstname} ha rechazado tu solicitud para unirte al equipo '{team.name}'."
            else:  # invitation
                notified_user_id = team.creator_id
                actor = User.query.get(user_id)
                message = f"{actor.firstname} ha rechazado tu invitación para unirse al equipo '{team.name}'."

            create_notification(
                user_id=notified_user_id,
                notif_type="team_request_rejected",
                message=message,
                data={
                    "team_id": team.id,
                    "team_name": team.name,
                    "from_user": {
                        "id": actor.id,
                        "firstname": actor.firstname,
                        "lastname": actor.lastname,
                        "profile_picture": actor.profile_picture
                    }
                }
            )

            db.session.commit()
            return jsonify({'message': 'Solicitud/invitación rechazada.'}), 200

        # 👉 ACEPTAR solicitud o invitación
        # Verificar si ya es miembro
        existing_member = TeamMember.query.filter_by(user_id=target_user_id, hackathon_id=team.hackathon_id).first()
        if existing_member:
            return jsonify({'error': 'El usuario ya es miembro de un equipo en este hackathon.'}), 400

        # Verificar límite de miembros
        current_member_count = TeamMember.query.filter_by(team_id=team.id).count()
        if current_member_count >= hackathon.max_team_members:
            return jsonify({'error': 'Este equipo ya alcanzó el número máximo de miembros permitido.'}), 400

        # Agregar como nuevo miembro
        new_member = TeamMember(user_id=target_user_id, team_id=team.id, hackathon_id=team.hackathon_id)
        db.session.add(new_member)
        team_request.status = 'accepted'

        # 🔔 Notificación de aceptación
        if team_request.type == 'application':
            notified_user_id = team_request.requested_by_id
            actor = User.query.get(user_id)
            message = f"{actor.firstname} ha aceptado tu solicitud para unirte al equipo '{team.name}'."
        else:  # invitation
            notified_user_id = team.creator_id
            actor = User.query.get(user_id)
            message = f"{actor.firstname} ha aceptado tu invitación y se ha unido al equipo '{team.name}'."

        create_notification(
            user_id=notified_user_id,
            notif_type="team_request_accepted",
            message=message,
            data={
                "team_id": team.id,
                "team_name": team.name,
                "from_user": {
                    "id": actor.id,
                    "firstname": actor.firstname,
                    "lastname": actor.lastname,
                    "profile_picture": actor.profile_picture
                }
            }
        )

        db.session.commit()
        return jsonify({'message': 'Solicitud/invitación aceptada.', 'team': team.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    

# --- Borrar una invitacion enviada (solo lider de equipo lo puede ver) o Cancelar una solicitud (Solo el usuario que la envio) --- #
@team_bp.route('/requests/<int:request_id>', methods=['DELETE'])
@jwt_required()
def cancel_invitation(request_id):
    try:
        user_id = get_jwt_identity()
        team_request = TeamRequest.query.get_or_404(request_id)
      

        if team_request.status != 'pending':
            return jsonify({'error': 'Solo se pueden cancelar invitaciones pendientes.'}), 400

        if team_request.requested_by_id != int(user_id) :
            return jsonify({'error': 'No tienes permisos para cancelar esta invitación.'}), 403
        db.session.delete(team_request)
        db.session.commit()
        return jsonify({'message': 'Invitación cancelada correctamente.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
    
    
    # --- Conseguir un equipo en especifico, por hackathon ---
@team_bp.route('/<int:team_id>/hackathons/<int:hackathon_id>', methods=['GET'])
@jwt_required()
def get_team_by_hackathon(hackathon_id, team_id):
    try:
        team = Team.query.filter_by(id=team_id, hackathon_id=hackathon_id).first()
        if not team:
            return jsonify({'error': 'No se encontró el equipo en este hackathon'}), 404

        return jsonify(team.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# --- Editar un equipo de un hackathon especifico --- #
@team_bp.route('/<int:hackathon_id>', methods=['PUT'])
@jwt_required()
def update_hackathon_team(hackathon_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Buscar el equipo creado por este usuario en este hackathon
        team = Team.query.filter_by(hackathon_id=hackathon_id, creator_id=user_id).first()
        if not team:
            return jsonify({'error': 'No se encontró el equipo o no tienes permisos para editarlo.'}), 403

        # Actualizar los campos que vengan en el request
        if 'name' in data:
            team.name = data['name']
        # si se quiere tener bio en el equipo, esta es la parte se descomenta
        if 'bio' in data:
           team.bio = data['bio']
        if 'github_url' in data:
            team.github_url = data['github_url']
        if 'live_preview_url' in data:
            team.live_preview_url = data['live_preview_url']

        db.session.commit()
        return jsonify(team.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@team_bp.route("/requests/me", methods=["GET"])
@jwt_required()
def get_all_my_requests():
    current_user_id = get_jwt_identity()
    invitations = TeamRequest.query.filter_by(user_id=current_user_id).all()
    applications = TeamRequest.query.filter_by(requested_by_id=current_user_id).all()
    all_requests = {r.id: r for r in invitations + applications}
    return jsonify([r.to_dict() for r in all_requests.values()])


#--- conseguir los puntos de un team ---#
@team_bp.route('/<int:team_id>/scores', methods=['GET'])
@jwt_required()
def get_team_scores(team_id):
    try:
        team = Team.query.get_or_404(team_id)
        scores = TeamScore.query.filter_by(team_id=team.id).all()
        return jsonify([score.to_dict() for score in scores]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

    #-- conseguir todos los scores, para un contexto de admin --#
@team_bp.route('/scores', methods=['GET'])
@jwt_required()
def get_all_team_scores():
    try:
        scores = TeamScore.query.all()
        return jsonify([score.to_dict() for score in scores]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500