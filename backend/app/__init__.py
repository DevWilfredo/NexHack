from flask import Flask
from .extensions import db, migrate, bcrypt, jwt, cors
from .routes.auth import auth_bp
from .routes.users import user_bp
from .config import Config


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

    return app
