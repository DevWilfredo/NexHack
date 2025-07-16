import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    API_PREFIX = "/api/v1"

    # Configuración de subida de imágenes
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "uploads", "profile_pictures")
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", 'webp'}
