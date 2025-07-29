import os
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from app.models.user import User
from app.models.team import TeamMember, Team
from app.models.hackathon import Hackathon, HackathonJudge
from app.models.evaluation import HackathonWinner
from app.models.feedback import UserTeamLike, UserTestimonial
from app.extensions import db
from app.utils.notifications import create_notification
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.schemas.user_schema import UserUpdateSchema
from marshmallow import ValidationError

user_bp = Blueprint("users", __name__)

@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    try:
        user_id = get_jwt_identity()
          
        users = User.query.all()
        results = list(map(lambda x: x.to_dict(), users))
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_single_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

    
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    schema = UserUpdateSchema()
    try:
        jwt_id = get_jwt_identity()
        if not str(user_id) == jwt_id:
            return jsonify({'error': 'You have not the required Permissions'}), 403

        user = User.query.get_or_404(user_id)
        data = request.form.to_dict()
        data = schema.load(data)

        if 'firstname' in data:
            user.firstname = data['firstname']
        if 'website_url' in data:
            user.website_url = data['website_url']
        if 'github_url' in data:
            user.github_url = data['github_url']
        if 'linkedin_url' in data:
            user.linkedin_url = data['linkedin_url']
        if 'lastname' in data:
            user.lastname = data['lastname']
        if 'email' in data:
            user.email = data['email']
        if 'bio' in data:
            user.bio = data['bio']
        if 'password' in data:
            user.set_password(data['password'])
        if 'file' in request.files:
            file = request.files['file']
            if file.filename != '' and allowed_file(file.filename):
                if user.profile_picture:
                    old_filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], user.profile_picture)
                    if os.path.exists(old_filepath):
                        os.remove(old_filepath)
                
                ext = file.filename.rsplit('.', 1)[1].lower()
                filename = secure_filename(f"user_{user.id}.{ext}")
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                user.profile_picture = filename

        db.session.commit()
        return jsonify(user.to_dict()), 200

    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@user_bp.route('/profile_pictures/<filename>', methods=['GET'])
def serve_profile_picture(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

@user_bp.route('/my-hackathons', methods=['GET'])
@jwt_required()
def get_my_hackathons():
    try:
        user_id = get_jwt_identity()

        # Hackathons como participante
        participant_ids = (
            db.session.query(TeamMember.hackathon_id)
            .filter(TeamMember.user_id == user_id)
            .distinct()
            .all()
        )
        participant_ids = [h[0] for h in participant_ids]

        # Hackathons como juez
        judge_ids = (
            db.session.query(HackathonJudge.hackathon_id)
            .filter(HackathonJudge.judge_id == user_id)
            .distinct()
            .all()
        )
        judge_ids = [h[0] for h in judge_ids]

        # Hackathons como creador
        creator_hackathons = Hackathon.query.filter(Hackathon.creator_id == user_id).all()

        # Un set para evitar duplicados
        seen = set()
        result = []

        # Agregar como creador
        for h in creator_hackathons:
            if h.id not in seen:
                data = h.to_dict()
                data["role"] = "creator"
                result.append(data)
                seen.add(h.id)

        # Agregar como juez
        for h in Hackathon.query.filter(Hackathon.id.in_(judge_ids)).all():
            if h.id not in seen:
                data = h.to_dict()
                data["role"] = "judge"
                result.append(data)
                seen.add(h.id)

        # Agregar como participante
        for h in Hackathon.query.filter(Hackathon.id.in_(participant_ids)).all():
            if h.id not in seen:
                data = h.to_dict()
                data["role"] = "participant"
                result.append(data)
                seen.add(h.id)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



def team_to_dict_with_ranking(team, hackathon_id):
    winner = HackathonWinner.query.filter_by(
        hackathon_id=hackathon_id,
        team_id=team.id
    ).first()

    return {
        **team.to_dict(),
        "ranking": winner.position if winner else None,
        "points_awarded": winner.points_awarded if winner else None,
    }


@user_bp.route('/<int:user_id>/hackathons', methods=['GET'])
@jwt_required()
def get_user_hackathons(user_id):
    try:
        # Hackathons como participante
        participant_ids = (
            db.session.query(TeamMember.hackathon_id)
            .filter(TeamMember.user_id == user_id)
            .distinct()
            .all()
        )
        participant_ids = [h[0] for h in participant_ids]

        # Hackathons como juez
        judge_ids = (
            db.session.query(HackathonJudge.hackathon_id)
            .filter(HackathonJudge.judge_id == user_id)
            .distinct()
            .all()
        )
        judge_ids = [h[0] for h in judge_ids]

        # Hackathons como creador
        creator_hackathons = Hackathon.query.filter(Hackathon.creator_id == user_id).all()

        # Un set para evitar duplicados
        seen = set()
        result = []

        for h in creator_hackathons:
            if h.id not in seen:
                data = h.to_dict()
                data["role"] = "creator"
                result.append(data)
                seen.add(h.id)

        for h in Hackathon.query.filter(Hackathon.id.in_(judge_ids)).all():
            if h.id not in seen:
                data = h.to_dict()
                data["role"] = "judge"
                result.append(data)
                seen.add(h.id)

        for h in Hackathon.query.filter(Hackathon.id.in_(participant_ids)).all():
            if h.id not in seen:
                data = h.to_dict()
                data["role"] = "participant"
                result.append(data)
                seen.add(h.id)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/likes', methods=['POST'])
@jwt_required()
def give_like():
    from_user = get_jwt_identity()
    data = request.get_json()
    to_user = data.get('to_user_id')
    team_id = data.get('team_id')
    hackathon_id = data.get('hackathon_id')

    if from_user == to_user:
        return jsonify({'error': 'No puedes darte like a ti mismo.'}), 400

    # Validación de existencia de equipo y usuarios
    team = Team.query.filter_by(id=team_id, hackathon_id=hackathon_id).first()
    if not team:
        return jsonify({'error': 'El equipo no pertenece al hackathon especificado.'}), 400

    user_ids_in_team = [member.user_id for member in team.members]
    print(f"Usuarios en el equipo: {user_ids_in_team}")
    if int(from_user) not in user_ids_in_team or to_user not in user_ids_in_team:
        return jsonify({'error': 'Ambos usuarios deben haber sido miembros del mismo equipo en este hackathon.'}), 403

    # 💡 Verificamos si ya existe un like entre estos dos usuarios (en cualquier hackathon)
    existing_like = UserTeamLike.query.filter_by(
        from_user_id=int(from_user),
        to_user_id=to_user
    ).first()

    if existing_like:
        return jsonify({'error': 'Ya diste like a este usuario anteriormente.'}), 409

    try:
        like = UserTeamLike(
            from_user_id=int(from_user),
            to_user_id=to_user,
            team_id=team_id,
            hackathon_id=hackathon_id
        )
        db.session.add(like)

        # 🔔 Crear notificación para el usuario que recibió el like
        from_user_obj = User.query.get(from_user)
        message = f"{from_user_obj.firstname} te dio un like en el equipo del hackathon."

        create_notification(
            user_id=to_user,
            notif_type="like_received",
            message=message,
            data={
                "from_user": {
                    "id": from_user_obj.id,
                    "firstname": from_user_obj.firstname,
                    "lastname": from_user_obj.lastname,
                    "profile_picture": from_user_obj.profile_picture,
                    "bio": from_user_obj.bio
                },
                "team_id": team_id,
                "hackathon_id": hackathon_id
            }
        )

        db.session.commit()
        return jsonify(like.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@user_bp.route('/testimonials', methods=['POST'])
@jwt_required()
def give_testimonial():
    data = request.get_json()
    from_user = get_jwt_identity()
    to_user = data.get('to_user_id')
    team_id = data.get('team_id')
    hackathon_id = data.get('hackathon_id')
    message = data.get('message')
    rating = data.get('rating')

    if from_user == to_user:
        return jsonify({'error': 'No puedes dejarte un testimonio a ti mismo.'}), 400

    if not message or message.strip() == "":
        return jsonify({'error': 'El mensaje no puede estar vacío.'}), 400

    if rating is None:
        return jsonify({'error': 'El rating es obligatorio.'}), 400
    
    try:
        rating = float(rating)
    except ValueError:
        return jsonify({'error': 'El rating debe ser un número válido.'}), 400

    if rating < 0 or rating > 5:
        return jsonify({'error': 'El rating debe estar entre 0 y 5.'}), 400

    team = Team.query.filter_by(id=team_id, hackathon_id=hackathon_id).first()
    if not team:
        return jsonify({'error': 'El equipo no pertenece al hackathon especificado.'}), 400

    user_ids_in_team = [member.user_id for member in team.members]
    if int(from_user) not in user_ids_in_team or to_user not in user_ids_in_team:
        return jsonify({'error': 'Ambos usuarios deben haber sido miembros del mismo equipo en este hackathon.'}), 403

    existing_testimonial = UserTestimonial.query.filter_by(
        from_user_id=int(from_user),
        to_user_id=to_user
    ).first()

    if existing_testimonial:
        return jsonify({'error': 'Ya diste un testimonio a este usuario anteriormente.'}), 409

    try:
        testimonial = UserTestimonial(
            from_user_id=int(from_user),
            to_user_id=to_user,
            team_id=team_id,
            hackathon_id=hackathon_id,
            message=message.strip(),
            rating=rating
        )
        db.session.add(testimonial)
        db.session.flush()  # Obtener testimonial.id antes del commit

        # 🔔 Crear notificación para el receptor del testimonio
        from_user_obj = User.query.get(from_user)
        message = f"{from_user_obj.firstname} te dejó un testimonio en el equipo del hackathon."

        create_notification(
            user_id=to_user,
            notif_type="testimonial_received",
            message=message,
            data={
                "from_user": {
                    "id": from_user_obj.id,
                    "firstname": from_user_obj.firstname,
                    "lastname": from_user_obj.lastname,
                    "profile_picture": from_user_obj.profile_picture,
                    "bio": from_user_obj.bio
                },
                "team_id": team_id,
                "hackathon_id": hackathon_id,
                "testimonial_id": testimonial.id,
                "message": message,
                "rating": rating
            }
        )

        db.session.commit()
        return jsonify(testimonial.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400



@user_bp.route('/likes/<int:user_id>', methods=['GET'])
def get_user_likes(user_id):
    likes = UserTeamLike.query.filter_by(to_user_id=user_id)\
        .join(User, User.id == UserTeamLike.from_user_id)\
        .order_by(UserTeamLike.created_at.desc()).all()

    return jsonify([
        {
            "id": like.id,
            "from_user": like.from_user.to_dict(),  # datos del que dio el like
            "hackathon_id": like.hackathon_id,
            "team_id": like.team_id,
            "created_at": like.created_at.isoformat()
        }
        for like in likes
    ]), 200


@user_bp.route('/testimonials/<int:user_id>', methods=['GET'])
def get_user_testimonials(user_id):
    testimonials = UserTestimonial.query.filter_by(to_user_id=user_id)\
        .join(User, User.id == UserTestimonial.from_user_id)\
        .order_by(UserTestimonial.created_at.desc()).all()

    return jsonify([t.to_dict() for t in testimonials
    ]), 200

