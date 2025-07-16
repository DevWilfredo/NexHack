from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.hackathon import  Tag

tags_bp = Blueprint('tags', __name__)

@tags_bp.route("/", methods=["GET"])

def get_tags():
    try:
        tags = Tag.query.all()
        results = list(map(lambda x: x.to_dict(), tags))
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
