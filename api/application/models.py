from . import db
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import reqparse, abort, Api, Resource, fields, marshal_with
import json
#Association table, many-many for entrants <-> games
# usersContests = db.Table('usersContests',
#     db.Column('userID', db.Integer, db.ForeignKey('users.id')),
#     db.Column('contestID', db.Integer, db.ForeignKey('contest.id'))
# )

#Entry Model and Schema
class Entry(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    entry_id = db.Column(db.BigInteger, unique=True)
    contest_name = db.Column(db.String(50))
    contest_id = db.Column(db.BigInteger)
    entry_fee = db.Column(db.Integer)
    captain = db.Column(db.String(25))
    util_1 = db.Column(db.String(25))
    util_2 = db.Column(db.String(25))
    util_3 = db.Column(db.String(25))
    util_4 = db.Column(db.String(25))
    util_5 = db.Column(db.String(25))

    def __repr__(self):
        return '<Entry {}>'.format(self.entry_id)

class EntrySchema():
    resource_fields = {
        "id": fields.Integer,
        "entry_id": fields.Integer,
        "contest_name": fields.String,
        "contest_id": fields.Integer,
        "entry_fee": fields.Integer,
        "captain": fields.String,
        "util_1": fields.String,
        "util_2": fields.String,
        "util_3": fields.String,
        "util_4": fields.String,
        "util_5": fields.String,
    }
    args_field = reqparse.RequestParser()
    args_field.add_argument("entry_id", type=int,help="entry id is required", required=True)
    args_field.add_argument("contest_name", type=str,help="contest name is required", required=True)
    args_field.add_argument("contest_id", type=int,help="contest id is required", required=True)
    args_field.add_argument("entry_fee", type=int,help="entry fee is required", required=True)

#Salaries Model and Schema
#note for this purpose, we need the contest id to be associated,
# even though it is not a part of the salaries csv
class Salary(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    contest_id = db.Column(db.BigInteger)
    player_name = db.Column(db.String(25))
    player_id = db.Column(db.BigInteger)
    roster_position = db.Column(db.String(5))
    salary = db.Column(db.Integer)
    team_abbr = db.Column(db.String(3))
    opp_team_abbr = db.Column(db.String(3))
    game_location = db.Column(db.String(3))
    datetime = db.Column(db.String(25))
    avg_pts = db.Column(db.Float)
    def __repr__(self):
        return '<Name: {}, PlayerID: {}, ContestID {}>'.format(self.player_name, self.player_id, self.contest_id)
class SalarySchema:
    resource_fields = {
        "id": fields.Integer,
        "contest_id": fields.Integer,
        "player_name": fields.String,
        "player_id": fields.Integer,
        "roster_position": fields.String,
        "salary": fields.Integer,
        "team_abbr": fields.String,
        "opp_team_abbr": fields.String,
        "game_location": fields.String,
        "datetime": fields.String,
        "avg_pts": fields.Float,
    }
    args_field = reqparse.RequestParser()
    args_field.add_argument("contest_id", type=int, required=True, help="contest_id is required")
    args_field.add_argument("player_name", type=str, required=True, help="player_name is required")
    args_field.add_argument("player_id", type=int, required=True, help="player_id is required")

#Outputs Model and Schema
# Dont really need this yet
# class Outputs(db.Model):
#     id = db.Column(db.BigInteger, primary_key=True)
#     entry_id = db.Column(db.BigInteger, unique=True)
#     contest_name = db.Column(db.String(50))
#     contest_id = db.Column(db.BigInteger)
#     entry_fee = db.Column(db.Integer)


#DK Salaries CSV Schema
#Position,Name + ID,Name,ID,
# Roster Position,Salary,
# Game Info,TeamAbbrev,AvgPointsPerGame
#
#DK Entries Example
#Entry ID,Contest Name,Contest ID,Entry Fee,
# CPT,UTIL,UTIL,UTIL,UTIL,UTIL,,Instructions
#
#DK Outputs Example
# Entry ID,Contest Name,Contest ID,Entry Fee,
# CPT,UTIL,UTIL,UTIL,UTIL,UTIL,,Instructions