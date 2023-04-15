from flask import flash, Flask, request, jsonify, render_template, redirect, url_for, session, Blueprint
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
from flask import current_app, Blueprint
from .models import db

main_app_frontend = Blueprint('main_app_frontend', __name__, template_folder='templates')
# app = current_app
