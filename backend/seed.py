from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.hackathon import Hackathon, HackathonRule, Tag
from app.models.notification import Notification
from datetime import datetime, timedelta
import random
from faker import Faker

faker = Faker()
app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Crear Tags con íconos asociados
    tag_names = [
        "React", "Vue", "Angular", "Node", "Python", "Django", "Flask", "Java", "Spring", "Kotlin",
        "Swift", "Go", "Rust", "C#", "Unity", "Unreal", "Php", "Laravel",
        "Ruby", "TypeScript", "Next.js", "Svelte"
    ]

    tag_icon_map = {
        "React": "React",
        "Vue": "Vue",
        "Angular": "Angular",
        "Python": "Python",
        "Django": "Django",
        "Flask": "FlaskLight",
        "Java": "Java",
        "Spring": "Spring",
        "Swift": "Swift",
        "TypeScript": "TypeScript",
        "Next.js": "Next",
        "Tailwind": "Tailwindcss",
        "Laravel": "Laravel",
        "Javascript": "Javascript",
        "Node" : "Node",
        "Kotlin":"Kotlin",
        "Go":"Go",
        "Rust":"Rust",
        "C#":"Cshare",
        "Unity":"Unity",
        "Unreal":"Unreal",
        "Php":"Php",
        "Ruby":"Ruby",
        "Svelte":"Svelte"
    }

    missing_icons = []
    tags = []
    for name in tag_names:
        icon_name = tag_icon_map.get(name)
        if not icon_name:
            missing_icons.append(name)
        tag = Tag(name=name, icon=icon_name)
        db.session.add(tag)
        tags.append(tag)
    db.session.commit()

    if missing_icons:
        print("⚠️ Faltan íconos para los siguientes tags, crea los componentes correspondientes:")
        for missing in missing_icons:
            print(f" - {missing}")

    # Crear usuarios
    users = []
    for i in range(50):
        role = "moderator" if i < 5 else "user"
        user = User(
            firstname=faker.first_name(),
            lastname=faker.last_name(),
            email=faker.unique.email(),
            role=role,
            profile_picture=None
        )
        user.set_password("password123")
        db.session.add(user)
        users.append(user)
    db.session.commit()

    # Crear notificaciones
    types = ['hackathon_start', 'invitation', 'evaluation', 'general']
    for user in users:
        for _ in range(5):
            note = Notification(
                user_id=user.id,
                type=random.choice(types),
                message=faker.sentence(),
                data=None
            )
            db.session.add(note)
    db.session.commit()

    # Crear hackathones
    TITLES = [
        "Reto de Frontend", "Hackathon Express", "Code Challenge", "Weekend Dev Jam",
        "Interfaz Creativa", "Startup Sprint", "Hack4Good", "CSS Battle", "Open Source Push",
        "Clean Code Hack"
    ]
    DESCRIPTIONS = [
        "Un reto intensivo para mejorar tus habilidades con frameworks modernos.",
        "Construye algo increíble en solo 48 horas.",
        "Participa en esta edición enfocada en buenas prácticas de UI/UX.",
        "Demuestra tus habilidades técnicas resolviendo problemas reales.",
        "Crea algo útil, creativo o divertido en un fin de semana."
    ]
    RULES_POOL = [
        "No usar IA generativa",
        "Tiempo límite de entrega: 48h",
        "Código debe estar en GitHub",
        "Presentación obligatoria en video",
        "Diseño responsivo obligatorio",
        "Uso de Tailwind recomendado"
    ]

    for i in range(25):
        creator = random.choice(users)
        title = f"{random.choice(TITLES)} #{i + 1}"
        description = random.choice(DESCRIPTIONS)
        start_date = datetime.utcnow() + timedelta(days=random.randint(5, 30))
        end_date = start_date + timedelta(days=3)
        hackathon = Hackathon(
            title=title,
            description=description,
            start_date=start_date,
            end_date=end_date,
            max_teams=random.randint(5, 15),
            max_team_members=random.randint(3, 6),
            creator_id=creator.id
        )

        for rule_text in random.sample(RULES_POOL, k=random.randint(2, 3)):
            hackathon.add_rule(rule_text)

        hackathon.add_tag(random.choice(tags))
        db.session.add(hackathon)
    db.session.commit()

    

    print("✅ Base de datos poblada con usuarios, notificaciones y hackathones.")
