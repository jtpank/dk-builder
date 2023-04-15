import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql://admin:cvg7fRDM7f70mB0p6k40@localhost/dk_builder'
    #JWT config
    #file upload config
    UPLOAD_FOLDER = './uploads'
    ALLOWED_EXTENSIONS = {'csv', 'txt'}