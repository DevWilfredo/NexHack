from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.hackathon import Tag
from faker import Faker

faker = Faker()
app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # ✅ Crear Tags con íconos asociados
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

    for name in tag_names:
        icon_name = tag_icon_map.get(name)
        tag = Tag(name=name, icon=icon_name)
        db.session.add(tag)

    db.session.commit()
    print("✅ Tags creadas correctamente.")

    # ✅ Crear 5 moderadores aleatorios
    for _ in range(5):
        user = User(
            firstname=faker.first_name(),
            lastname=faker.last_name(),
            email=faker.unique.email(),
            role="moderator",
            profile_picture=None
        )
        user.set_password("password123")
        db.session.add(user)

    # ✅ Moderadores específicos
    specific_moderators = [
        {
            "firstname": "Wilfredo",
            "lastname": "Pinto",
            "email": "wilfredo@gmail.com",
            "password": "holahola2"
        },
        {
            "firstname": "Luis",
            "lastname": "Peres",
            "email": "luis@gmail.com",
            "password": "holahola2"
        },
        {
            "firstname": "Tomas",
            "lastname": "Sarciat Roch",
            "email": "tomas@gmail.com",
            "password": "holahola2"
        }
    ]

    for mod in specific_moderators:
        user = User(
            firstname=mod["firstname"],
            lastname=mod["lastname"],
            email=mod["email"],
            role="moderator",
            profile_picture=None
        )
        user.set_password(mod["password"])
        db.session.add(user)

    # ✅ Crear 50 usuarios normales
    for _ in range(50):
        user = User(
            firstname=faker.first_name(),
            lastname=faker.last_name(),
            email=faker.unique.email(),
            role="user",
            profile_picture=None
        )
        user.set_password("password123")
        db.session.add(user)

    db.session.commit()
    print("✅ Usuarios creados: 5 moderadores aleatorios, 3 específicos, 50 usuarios normales.")
