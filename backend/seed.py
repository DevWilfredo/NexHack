from app import create_app
from app.extensions import db
from app.models.user import User

app = create_app()

with app.app_context():
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
