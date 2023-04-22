from flask import Blueprint
from .models import db

main_app_frontend = Blueprint('main_app_frontend', __name__, template_folder='templates')
# app = current_app
