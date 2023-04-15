
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
from .models import Salaries, SalariesSchema, Entry, EntrySchema


api_main = Blueprint('api', __name__, template_folder='templates')
api = Api(api_main)
app = current_app

#auxiliary functions
def parseEntryCsv(filename):
    with open(filename) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if(row['Entry ID']):
                print(row['Entry ID'], row['Contest Name'])


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
    schema = SalariesSchema()
    @marshal_with(schema.resource_fields)
    def get(self):
        data = {"hit get salaries" : "route"}
        return data, 200
    # @marshal_with(schema.resource_fields)
    def put(self):
        if 'file' not in request.files:
            return {'message': 'No file found!'}, 400
        file = request.files['file']
        # try:
        #     file = request.files['file']
        #     if not file.filename.lower().endswith('.csv'):
        #         return {'message': 'Invalid file format. Only CSV files are allowed.'}, 400
        #     # Parse the CSV file and process the data here
        #     # ...
        #     return {'message': 'File uploaded and processed successfully'}, 200
        # except Exception as e:
        #     return {'message': 'Failed to upload and process file: {}'.format(str(e))}, 500

        filename = secure_filename(file.filename)
        fullPath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(fullPath)
        return {'message': 'Salary file uploaded and processed successfully'}, 201
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
        # try:
        #     file = request.files['file']
        #     if not file.filename.lower().endswith('.csv'):
        #         return {'message': 'Invalid file format. Only CSV files are allowed.'}, 400
        #     # Parse the CSV file and process the data here
        #     # ...
        #     return {'message': 'File uploaded and processed successfully'}, 200
        # except Exception as e:
        #     return {'message': 'Failed to upload and process file: {}'.format(str(e))}, 500

        filename = secure_filename(file.filename)
        fullPath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(fullPath)
        parseEntryCsv(fullPath)
        return {'message': 'Entry file uploaded and processed successfully'}, 201
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