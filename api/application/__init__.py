import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config as CFG
from datetime import timedelta
from werkzeug.middleware.proxy_fix import ProxyFix

db = SQLAlchemy()
def create_app():
    app = Flask(__name__, static_url_path='/static')
    app.config['SQLALCHEMY_DATABASE_URI'] = CFG.SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = CFG.UPLOAD_FOLDER
    app.config['DOWNLOAD_FOLDER'] = CFG.DOWNLOAD_FOLDER
    app.config["JWT_SECRET_KEY"] = "adsf4235adfsg3%#$@sg5LPLPLA67@"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)
    app.secret_key = "sxasd342r2q345gasdg"
    db.init_app(app)

    with app.app_context():
        from . import models
        db.create_all()
        from . import routes
        app.register_blueprint(routes.main_app_frontend)
        from . import api_routes
        app.register_blueprint(api_routes.api_main)
        # app.wsgi_app = ProxyFix(
        #     app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
        # )
        jwt = JWTManager(app)
        CORS(app, resources={r'/api/*': {"origins": "*"}}, methods=['GET', 'PUT', 'POST'])
        return app
