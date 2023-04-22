
from flask import flash, Flask, request, jsonify, render_template, redirect, url_for, session, Blueprint, make_response, json
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from werkzeug.utils import secure_filename
from flask_restful import reqparse, abort, Api, Resource, fields, marshal_with
from flask import current_app, Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc, and_
from .models import db
import openpyxl as opx
import os
import subprocess
import csv
import time
import numpy as np
import ast
from .models import Salary, SalarySchema, Entry, EntrySchema
import json

api_main = Blueprint('api', __name__, template_folder='templates')
api = Api(api_main)
app = current_app

#auxiliary functions
def parseEntryCsv(filename, listOfDicts):
    # "entry_id": fields.Integer,
    # "contest_name": fields.String,
    # "contest_id": fields.Integer,
    # "entry_fee": fields.Integer,
    # "captain": fields.String,
    contestId_return = -1
    with open(filename) as csvfile:
        reader = csv.DictReader(csvfile)
        number_entries = 0
        for row in reader:
            if(row['Entry ID']):
                number_entries+=1
                #build the temp dict
                #then append to listOfDicts
                contestId_return = (int)(row['Contest ID'])
                temp_dict = {
                    "entry_id": (int)( row['Entry ID']),
                    "contest_name": row['Contest Name'],
                    "contest_id": (int)(row['Contest ID']),
                    "entry_fee": (int)(row['Entry Fee'][1:]),
                }
                listOfDicts.append(temp_dict)
    return contestId_return, number_entries

def parseSalaryCsv(filename, listOfDicts, contestID):
    # "contest_id": fields.Integer,
    # "player_name": fields.String,
    # "player_id": fields.Integer,
    # "roster_position": fields.String,
    # "salary": fields.Integer,
    # "team_abbr": fields.String,
    # "opp_team_abbr": fields.String,
    # "game_location": fields.String,
    # "datetime": fields.String,
    # "avg_pts": fields.Float,
    #Position,Name + ID,Name,ID,Roster Position,Salary,Game Info,TeamAbbrev,AvgPointsPerGame
    with open(filename) as csvfile:
        reader = csv.DictReader(csvfile)
        cpt_return_dict = {
            "values": []
        }
        util_return_dict = {
            "values": []
        }
        for row in reader:
            if(row['Position']):
                #build the temp dict
                #then append to listOfDicts
                strGameInfo = row['Game Info']
                splitStrGameInfo = strGameInfo.split(' ', 1)
                teamAtTeam = splitStrGameInfo[0]
                dateTime = splitStrGameInfo[1]
                splitTeamAtTeam = teamAtTeam.split('@')
                awayTeam = splitTeamAtTeam[0]
                homeTeam = splitTeamAtTeam[1]
                oppTeam = awayTeam
                if row['TeamAbbrev'] == awayTeam:
                    oppTeam = homeTeam
                temp_dict = {
                    "contest_id": contestID,
                    "player_name": row['Name'],
                    "player_id": (int)(row['ID']),
                    "roster_position": row['Roster Position'],
                    "salary": (int)(row['Salary']),
                    "team_abbr": row['TeamAbbrev'],
                    "opp_team_abbr": oppTeam,
                    "game_location": homeTeam,
                    "datetime": dateTime,
                    "avg_pts": (float)(row['AvgPointsPerGame'])
                }
                if(row['Roster Position'] == 'CPT'):
                    cpt_return_dict['values'].append(temp_dict)
                if(row['Roster Position'] == 'UTIL'):
                    util_return_dict['values'].append(temp_dict)
                listOfDicts.append(temp_dict)
        ret_dict ={
            "Captains": cpt_return_dict,
            "Utility": util_return_dict
        }
        return ret_dict

#404 response if field not existent
def abort_if_field_not_exist(data_field, data):
    if data_field not in data:
        abort(404, message="error_message_field: {} does not exist".format(data_field))
#404 response if field not existent
def abort_if_none(data, _id):
    if data is None:
        abort(404, error_message_field="Field: {} does not exist".format(_id))
def abort_if_table_none(data):
    if data is None:
        abort(404, error_message_field="Field: table does not exist")

class salaries_route(Resource):
    schema = SalarySchema()
    # @marshal_with(schema.resource_fields)
    def get(self):
        data_return = {"Home": {"values" : 
                                {"ID": {"Name": "n", "Sal": 10}}
                                },
                        "Away": {"values"}
                                }
        
        data = {"hit get salaries" : "route"}
        return data, 200
    # @marshal_with(schema.resource_fields)
    def put(self):
        if 'file' not in request.files:
            return {'message': 'No file found!'}, 400
        file = request.files['file']
        try:
            file = request.files['file']
            contest_id = request.files['blob']
            json_str = contest_id.read().decode('utf-8')
            data_dict = json.loads(json_str)
            contest_id_number = data_dict['contest_id']
            if contest_id_number < 0:
                return {'message': 'Salary file upload error: cannot use negative contest id', 'contest_id': -1}, 200
            if not file.filename.lower().endswith('.csv'):
                return {'message': 'Invalid file format. Only CSV files are allowed.'}, 400
            filename = secure_filename(file.filename)
            fullPath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(fullPath)
            listOfDicts = []

            captain_and_utility_salary_dict = parseSalaryCsv(fullPath,listOfDicts, contest_id_number)
            for k in listOfDicts:
                if db.session.query(Salary.id).filter_by(**k).first() is None:
                  t = Salary(**k)
                  db.session.add(t)
                else:
                    print("salary already exists!")
            db.session.commit()
            ret_data=  {
                'message': 'Salary file uploaded and processed successfully', 
                'contest_id': -1,
                'salary_data': captain_and_utility_salary_dict
                }
            return ret_data, 200
        except Exception as e:
            return {'message': 'Failed to upload and process salary file: {}'.format(str(e))}, 500
    #delete lineup
    #tokenize
    #TODO: update for team_name delete entry
    def delete(self):
        return '', 204
    
class entries_route(Resource):
    schema = EntrySchema()
    @marshal_with(schema.resource_fields)
    def get(self):
        data = {"hit get entries" : "route"}
        return data, 200
    # @marshal_with(schema.resource_fields)
    def put(self):
        if 'file' not in request.files:
            return {'message': 'No file found!'}, 400
        file = request.files['file']
        try:
            file = request.files['file']
            if not file.filename.lower().endswith('.csv'):
                return {'message': 'Invalid file format. Only CSV files are allowed.'}, 400
            filename = secure_filename(file.filename)
            fullPath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(fullPath)
            listOfDicts = []
            contestId_return, num_entries_return = parseEntryCsv(fullPath,listOfDicts)
            for k in listOfDicts:
                if db.session.query(Entry.id).filter_by(**k).first() is None:
                  print(str(k))
                  t = Entry(**k)
                  db.session.add(t)
                else:
                    print("entry already exists!")
            db.session.commit()
            ret_data =  {
                'message': 'Entry file uploaded and processed successfully', 
                'contest_id': contestId_return,
                'num_entries': num_entries_return,
                'entry_data': listOfDicts
                }
            return ret_data, 200
        except Exception as e:
            return {'message': 'Failed to upload and process file: {}'.format(str(e))}, 500


    #delete lineup
    #tokenize
    #TODO: update for team_name delete entry
    def delete(self):
        return '', 204


# class exampleRoute(Resource):
#     schema = UserSchema()
#     #get teams
#     #tokenize
#     @marshal_with(schema.resource_fields)
#     def get(self):
#         #query database for the team database -->
#         #TODO: this is an entry for all team names
#         data = db.session.query(UserSchema).all()
#         abort_if_table_none(data)
#         result_dict = {}
#         # Loop through the results and add them to the dictionary
#         for result in data:
#             # Use the `id` attribute of the result as the key
#             key = result.id
#             # Use a dictionary comprehension to create a dictionary of the remaining data
#             value = {column.name: getattr(result, column.name) for column in result.__table__.columns if column.name != 'id'}
#             # Add the key-value pair to the dictionary
#             result_dict[key] = value
#         return data, 200
#     #add/update team
#     #tokenize
#     @marshal_with(schema.resource_fields)
#     def put(self):
#         args = schema.args_field.parse_args()
#         return args, 201
#     #delete lineup
#     #tokenize
#     #TODO: update for team_name delete entry
#     def delete(self):
#         return '', 204



class index_class(Resource):
    def get(self):
        # listDict = []
        # fileIn = "team_names.csv"
        # pushTeamNames(fileIn, listDict)
        # for k in listDict:
        #     print("in for loop: " + str(k))
        #     if db.session.query(NFL_TEAM_LIST_NAMES.id).filter_by(**k).first() is None:
        #       t = NFL_TEAM_LIST_NAMES(**k)
        #       db.session.add(t)
        # db.session.commit()
        return {"api-for-dk" : "index_page"}
#add resources
api.add_resource(index_class, '/api')
api.add_resource(salaries_route, '/api/salaries-route')
api.add_resource(entries_route, '/api/entries-route')
# api.add_resource(exampleRoute, '/api/example')