import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql://root:passworD12345!@localhost/dk_builder'
    #JWT config
    JWT_SECRET_KEY = 'adsf4235adfsg3%#$@sg5LPLPLA67@'
    #file upload config
    UPLOAD_FOLDER = './uploads'
    DOWNLOAD_FOLDER = '/application/downloads'
    ALLOWED_EXTENSIONS = {'csv', 'txt'}