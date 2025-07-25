from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.team import Team,TeamMember,TeamRequest
from app.models.user import User

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
        )
        db.session.add(team)
        db.session.flush()
        team_member = TeamMember(
            user_id=user_id,
            team_id=team.id,
            hackathon_id=hackathon_id
        )
        db.session.add(team_member)
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

        # Verificar si el usuario ya pertenece a un equipo en este hackathon
        existing_member = TeamMember.query.filter_by(user_id=user_id, hackathon_id=hackathon_id).first()
        if existing_member:
            return jsonify({'error': 'Ya eres miembro de un equipo en este hackathon.'}), 400

        # Verificar si ya existe una solicitud pendiente
        existing_request = TeamRequest.query.filter_by(user_id=user_id, team_id=team_id, status='pending').first()
        if existing_request:
            return jsonify({'error': 'Ya tienes una solicitud pendiente para este equipo.'}), 400

        team_request = TeamRequest(
            team_id=team_id,
            user_id=user_id,
            requested_by_id=user_id,
            type='application',
            status='pending'
        )
        db.session.add(team_request)
        db.session.commit()
        return jsonify({'message': 'Solicitud enviada correctamente.', 'request': team_request.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# --- Invitar a un usuario a un equipo (invitation) ---
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

        # Solo el creador puede invitar
        if team.creator_id != int(creator_id):
            return jsonify({'error': 'Solo el creador del equipo puede invitar usuarios.'}), 403

        # Verificar si el usuario ya pertenece a un equipo en este hackathon
        existing_member = TeamMember.query.filter_by(user_id=user_id, hackathon_id=hackathon_id).first()
        if existing_member:
            return jsonify({'error': 'El usuario ya es miembro de un equipo en este hackathon.'}), 400

        # Verificar si ya existe una invitación pendiente
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
        db.session.commit()
        return jsonify({'message': 'Invitación enviada correctamente.', 'request': team_request.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# --- Aceptar o rechazar solicitud/invitación ---
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

        # Validar permisos
        if team_request.type == 'application':
            # Solo el creador del equipo puede aceptar/rechazar
            if team.creator_id != int(user_id):
                return jsonify({'error': 'Solo el creador del equipo puede gestionar esta solicitud.'}), 403
        elif team_request.type == 'invitation':
            # Solo el usuario invitado puede aceptar/rechazar
            if team_request.user_id != int(user_id):
                return jsonify({'error': 'Solo el usuario invitado puede gestionar esta invitación.'}), 403

        if team_request.status != 'pending':
            return jsonify({'error': 'Esta solicitud ya fue gestionada.'}), 400

        if action == 'reject':
            team_request.status = 'rejected'
            db.session.commit()
            return jsonify({'message': 'Solicitud/invitación rechazada.'}), 200

        # Si es accept, verificar que el usuario no esté ya en un equipo del hackathon
        existing_member = TeamMember.query.filter_by(user_id=team_request.user_id, hackathon_id=team.hackathon_id).first()
        if existing_member:
            team_request.status = 'rejected'
            db.session.commit()
            return jsonify({'error': 'El usuario ya es miembro de un equipo en este hackathon.'}), 400

        # Aceptar: crear TeamMember
        new_member = TeamMember(user_id=team_request.user_id, team_id=team.id, hackathon_id=team.hackathon_id)
        db.session.add(new_member)
        team_request.status = 'accepted'
        db.session.commit()
        return jsonify({'message': 'Solicitud/invitación aceptada.', 'team': team.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    

    # --- Borrar una invitacion enviada, SOLO POR EL LIDER DE EQUIPO --- #
@team_bp.route('/requests/<int:request_id>', methods=['DELETE'])
@jwt_required()
def cancel_invitation(request_id):
    try:
        user_id = get_jwt_identity()
        team_request = TeamRequest.query.get_or_404(request_id)

        if team_request.type != 'invitation':
            return jsonify({'error': 'Solo se pueden cancelar invitaciones.'}), 400

        if team_request.status != 'pending':
            return jsonify({'error': 'Solo se pueden cancelar invitaciones pendientes.'}), 400

        if team_request.requested_by_id != int(user_id):
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