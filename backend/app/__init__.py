import os
from flask import Flask
from dotenv import load_dotenv

# Carga el .env manualmente desde la carpeta backend
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)
from .extensions import db, migrate, bcrypt, jwt, cors
from .routes.auth import auth_bp
from .routes.users import user_bp
from .routes.hackathons import hackathon_bp
from .routes.tags import tags_bp
from .routes.teams import team_bp
from .config import Config
from .models import hackathon, user, evaluation, feedback, notification, points, team
from app.routes.notifications import notifications_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)

    api_prefix = app.config["API_PREFIX"]
    app.register_blueprint(auth_bp, url_prefix=f"{api_prefix}/auth")
    app.register_blueprint(user_bp, url_prefix=f"{api_prefix}/users")
    app.register_blueprint(hackathon_bp, url_prefix=f"{api_prefix}/hackathons")
    app.register_blueprint(tags_bp, url_prefix=f"{api_prefix}/tags")
    app.register_blueprint(team_bp, url_prefix=f"{api_prefix}/teams")
    app.register_blueprint(notifications_bp)
    
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    return app
