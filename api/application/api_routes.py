
from flask import flash, Flask, request, jsonify, render_template, redirect, url_for, session, Blueprint, make_response, json
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from werkzeug.security import check_password_hash
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
from .models import Salaries, SalariesSchema


api_main = Blueprint('api', __name__, template_folder='templates')
api = Api(api_main)


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
    @marshal_with(schema.resource_fields)
    def put(self):
        args = schema.args_field.parse_args()
        return args, 201
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
# api.add_resource(exampleRoute, '/api/example')