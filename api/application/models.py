from . import db
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import reqparse, abort, Api, Resource, fields, marshal_with
import json
#Association table, many-many for entrants <-> games
# usersContests = db.Table('usersContests',
#     db.Column('userID', db.Integer, db.ForeignKey('users.id')),
#     db.Column('contestID', db.Integer, db.ForeignKey('contest.id'))
# )

#User and Schema
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30))
    email = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(120))

    def __repr__(self):
        return '<USERS {}>'.format(self.username)
    def __init__(self, username, email, password):
        self.username =     username
        self.email =        email
        self.password =     generate_password_hash(password)

class UserSchema():
    resource_fields = {
        "id": fields.Integer,
        "username": fields.String,
        "email": fields.String,
    }
    args_field = reqparse.RequestParser()
    args_field.add_argument("username", type=str,help="username is required", required=True)
    args_field.add_argument("email", type=str,help="email is required", required=True)
    args_field.add_argument("password", type=str,help="password of user is required", required=True)

