from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.hackathon import Hackathon, Tag, HackathonRule
from datetime import datetime, timedelta
import random

app = create_app()

with app.app_context():
    # 👉 Crear moderador si no existe
    email = "moderator@example.com"
    existing_user = User.query.filter_by(email=email).first()

    if not existing_user:
        user = User(
            firstname="Moderador",
            lastname="Inicial",
            email=email,
            role="moderator"
        )
        user.set_password("mod1234")
        db.session.add(user)
        db.session.commit()
        print("✅ Usuario moderador creado correctamente.")
    else:
        print("ℹ️ El usuario moderador ya existe.")

    # 👉 Crear tags si no existen
    tag_names = [
        "React", "Vue", "Angular", "Node", "Python", "Django", "Flask", "Java", "Spring", "Kotlin",
        "Swift", "iOS", "Android", "Go", "Rust", "C#", "Unity", "Unreal", "PHP", "Laravel",
        "Ruby", "Rails", "TypeScript", "Next.js", "Svelte"
    ]

    tag_map = {}
    for name in tag_names:
        tag = Tag.query.filter_by(name=name).first()
        if not tag:
            tag = Tag(name=name)
            db.session.add(tag)
        tag_map[name] = tag
    db.session.commit()

    # 👉 Crear 25 hackathones
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
        title = f"{random.choice(TITLES)} #{i + 1}"
        description = random.choice(DESCRIPTIONS)
        start_date = datetime.strptime(f"2025-08-{(i % 28) + 1:02d}", "%Y-%m-%d")
        end_date = datetime.strptime(f"2025-09-{(i % 28) + 1:02d}", "%Y-%m-%d")
        max_teams = 10 + i
        max_team_members = 5 + (i % 10)
        creator_id = 1

        hackathon = Hackathon(
            title=title,
            description=description,
            start_date=start_date,
            end_date=end_date,
            max_teams=max_teams,
            max_team_members=max_team_members,
            creator_id=creator_id
        )

        # 👉 Agregar reglas como objetos
        selected_rules = random.sample(RULES_POOL, k=random.randint(2, 3))
        for rule_text in selected_rules:
            hackathon.add_rule(rule_text)

        # 👉 Agregar tags relacionadas
        tag_name = tag_names[i]  # usa una diferente por cada uno
        tag = tag_map[tag_name]
        hackathon.add_tag(tag)

        db.session.add(hackathon)

    db.session.commit()
    print("✅ 25 hackathones creados correctamente con reglas y tags.")