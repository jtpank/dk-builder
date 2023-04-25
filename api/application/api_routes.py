
from flask import flash, Flask, request, jsonify, render_template, redirect, url_for, session, Blueprint, make_response, json
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
from flask_restful import reqparse, abort, Api, Resource, fields, marshal_with
from flask import current_app, Blueprint, send_file, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc, and_, distinct, or_
from .models import db
import openpyxl as opx
import os
import subprocess
import csv
import time
import numpy as np
import ast
from .models import Salary, SalarySchema, Entry, EntrySchema, Users, UserSchema
import json

api_main = Blueprint('api', __name__, template_folder='templates')
api = Api(api_main)
app = current_app


#auxiliary functions
def parseEntryCsv(filename, listOfDicts, inputEmail):
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
                contestName_return = (str)(row['Contest Name'])
                temp_dict = {
                    "email": inputEmail,
                    "entry_id": (int)( row['Entry ID']),
                    "contest_name": row['Contest Name'],
                    "contest_id": (int)(row['Contest ID']),
                    "entry_fee": (float)(row['Entry Fee'][1:]),
                }
                listOfDicts.append(temp_dict)
    return contestName_return, contestId_return, number_entries

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

def lint_lineups(lineup_array):
    failure_dict = {}
    for lineup in lineup_array:
        entry_id = lineup['_entry_id']
        captain = lineup['_captain']
        utilityArray = lineup['_utility']
        name_array = []
        salary_array = []
        team_array = []
        all_empty = True
        if(bool(captain)):
            name_array.append(captain['player_name'])
            salary_array.append(captain['salary'])
            team_array.append(captain['team_abbr'])
            all_empty = False
        for utility in utilityArray:
            if(bool(utility)):
                name_array.append(utility['player_name'])
                salary_array.append(utility['salary'])
                team_array.append(utility['team_abbr'])
                all_empty = False
        #check name_array is all unique
        for i in range(len(name_array)):
            for j in range(i+1, len(name_array)):
                if(name_array[i] == name_array[j]):
                    failure_dict[entry_id] = ["duplicate-name-error"]
        # check that salary does not exceed 50,000
        if(sum(salary_array) > 50000):
            if entry_id in failure_dict:
                failure_dict[entry_id].append("exceed-salary-cap-error")
            else:
                failure_dict[entry_id] = ["exceed-salary-cap-error"]
        #check that at least 2 players are different / all players NOT same team
        if(len(set(team_array)) == 1 and len(name_array) == 6):
            if entry_id in failure_dict:
                failure_dict[entry_id].append("all-players-on-same-team-error")
            else:
                failure_dict[entry_id] = ["all-players-on-same-team-error"]
        if(all_empty):
            failure_dict[entry_id] = ["all-empty"]
    return failure_dict

def parse_linted_lineups(failure_dict, lineup_array):
    good_lineups_array = []
    for i in range(0, len(lineup_array)):
        lineup_key = lineup_array[i]['_entry_id']
        if lineup_key not in failure_dict:
            temp_dict = {
                "entry_id": lineup_array[i]['_entry_id']
            }
            if lineup_array[i]['_captain']:
                temp_dict["captain"] = lineup_array[i]['_captain']['player_id']
            else:
                temp_dict["captain"] = None
            if lineup_array[i]['_utility'][0]:
                temp_dict["util_1"] = lineup_array[i]['_utility'][0]['player_id']
            else:
                temp_dict["util_1"] = None
            if lineup_array[i]['_utility'][1]:
                temp_dict["util_2"] = lineup_array[i]['_utility'][1]['player_id']
            else:
                temp_dict["util_2"] = None
            if lineup_array[i]['_utility'][2]:
                temp_dict["util_3"] = lineup_array[i]['_utility'][2]['player_id']
            else:
                temp_dict["util_3"] = None
            if lineup_array[i]['_utility'][3]:
                temp_dict["util_4"] = lineup_array[i]['_utility'][3]['player_id']
            else:
                temp_dict["util_4"] = None
            if lineup_array[i]['_utility'][4]:
                temp_dict["util_5"] = lineup_array[i]['_utility'][4]['player_id']
            else:
                temp_dict["util_5"] = None
            good_lineups_array.append(temp_dict)
    return good_lineups_array

def build_csv_entry_file(all_matching_contests, relPath):
    #Entry ID,Contest Name,Contest ID,Entry Fee,CPT,UTIL,UTIL,UTIL,UTIL,UTIL,,Instructions
    #2556787883,NBA Showdown $12.5K And-One (BKN vs LAL),103590221,$1,16430531,16430549,16430538,16430532,16430540,16430541,,
    _FIRST_LINE = "Entry ID,Contest Name,Contest ID,Entry Fee,CPT,UTIL,UTIL,UTIL,UTIL,UTIL,,Instructions"
    try:
        cwd = os.getcwd()
        path = cwd+relPath
        with open(path, "w+") as f:
            f.write(_FIRST_LINE+'\n')
            for i in range(len(all_matching_contests)):
                lineup = all_matching_contests[i]
                line = ""
                line += str(lineup['entry_id']) + ','
                line += str(lineup['contest_name']) + ','
                line += str(lineup['contest_id']) + ','
                line += '$'+str(lineup['entry_fee']) + ','
                line += str(lineup['captain']) + ','
                line += str(lineup['util_1']) + ','
                line += str(lineup['util_2']) + ','
                line += str(lineup['util_3']) + ','
                line += str(lineup['util_4']) + ','
                line += str(lineup['util_5']) + ','
                line += ','
                f.write(line+'\n')
            f.close()
    except Exception as e:
        print(str(e))
# end auxiliary functions

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
    @jwt_required()
    def get(self):
        data_return = {"Home": {"values" : 
                                {"ID": {"Name": "n", "Sal": 10}}
                                },
                        "Away": {"values"}
                                }
        
        data = {"hit get salaries" : "route"}
        return data, 200
    # @marshal_with(schema.resource_fields)
    @jwt_required()
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
            #todo: os.mkdir
            fullPath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(fullPath)
            listOfDicts = []

            captain_and_utility_salary_dict = parseSalaryCsv(fullPath,listOfDicts, contest_id_number)
            for k in listOfDicts:
                # (Entry).filter(
                #             Entry.contest_id == contest_id
                #     )
                # if db.session.query(Salary.id).filter_by(**k).first() is None:
                #   t = Salary(**k)
                #   db.session.add(t)
                if db.session.query(Salary).filter_by(contest_id=k['contest_id'], player_id=k['player_id']).first() is None:
                    t = Salary(**k)
                    db.session.add(t)
            db.session.commit()
            os.remove(fullPath)
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
    @jwt_required()
    def delete(self):
        return '', 204
    
class entries_route(Resource):
    schema = EntrySchema()
    @jwt_required()
    @marshal_with(schema.resource_fields)
    def get(self):
        data = {"hit get entries" : "route"}
        return data, 200
    # @marshal_with(schema.resource_fields)
    @jwt_required()
    def put(self):
        if 'file' not in request.files:
            return {'message': 'No file found!'}, 400
        file = request.files['file']
        try:
            file = request.files['file']
            email_str = request.files['blob_email']
            json_str = email_str.read().decode('utf-8')
            data_dict = json.loads(json_str)
            inputEmail = data_dict['email']
            if not file.filename.lower().endswith('.csv'):
                return {'message': 'Invalid file format. Only CSV files are allowed.'}, 400
            filename = secure_filename(file.filename)
            fullPath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(fullPath)
            listOfDicts = []
            contestName_return, contestId_return, num_entries_return = parseEntryCsv(fullPath,listOfDicts, inputEmail)
            for k in listOfDicts:
                if db.session.query(Entry.id).filter_by(**k).first() is None:
                  print(str(k))
                  t = Entry(**k)
                  db.session.add(t)
            db.session.commit()
            os.remove(fullPath)
            ret_data =  {
                'message': 'Entry file uploaded and processed successfully', 
                'contest_id': contestId_return,
                'contest_name': contestName_return,
                'num_entries': num_entries_return,
                'entry_data': listOfDicts
                }
            return ret_data, 200
        except Exception as e:
            return {'message': 'Failed to upload and process file: {}'.format(str(e))}, 500


    #delete lineup
    #tokenize
    #TODO: update for team_name delete entry
    @jwt_required()
    def delete(self):
        return '', 204

class save_lint_entries_route(Resource):
    schema = EntrySchema()
    def get(self):
        data = {"hit get entries" : "route"}
        return data, 200
     # @marshal_with(schema.resource_fields)
    @jwt_required()
    def put(self):
        try:
            #need to lint
            lineup_data = request.get_json()
            lineup_array = lineup_data['lineupData']
            email_addr = lineup_data['email']
            if(len(lineup_array) == 0):
                return {'message': 'Failed to save, all lineups are empty'}, 200
            ret_failure_dict = lint_lineups(lineup_array)
            #makes a post request with all the lineups that had NO failures
            good_lineups = parse_linted_lineups(ret_failure_dict, lineup_array)
            #now save lineups. if lineup existst, overwrite it
            for k in good_lineups:
                data_entry = db.session.query(Entry).filter(
                        Entry.email == email_addr,
                        Entry.entry_id == k['entry_id']
                ).first()
                if data_entry is not None:
                    data_entry.captain = k['captain']
                    data_entry.util_1 = k['util_1']
                    data_entry.util_2 = k['util_2']
                    data_entry.util_3 = k['util_3']
                    data_entry.util_4 = k['util_4']
                    data_entry.util_5 = k['util_5']
                    db.session.add(data_entry)
                else:
                    print("You must have an entry before updating! Please upload entries file!")
            db.session.commit()
            ret_data =  {
                'message': 'Succesfully checked and saved your lineups!',
                'failure_dict': ret_failure_dict 
            }
            return ret_data, 200
        except Exception as e:
            return {'message': 'Failed to check and save your lineups: {}'.format(str(e))}, 500

#User login and sign up routes + protected route example:
class loginRoute(Resource):
    def get(self):
        return {"get login" : "this is the login get page"}
    def put(self):
        data = request.json["credentials"]
        email = data.get("email", None)
        password = data.get("password", None)
        #now query database for matching email and password
        user_email = db.session.query(Users).filter_by(email=email).first()
        if not user_email:
            response = jsonify({"msg": "Cannot find a user with that email!"})
            return make_response(response, 401)
        else:
            #userEmail.password == generate_password_hash(password):
            if check_password_hash(user_email.password, password):
                access_token = create_access_token(identity=email)
                return make_response(jsonify(access_token=access_token), 200) 
            else:
                response = jsonify({"msg": "Invalid Password"})
                return make_response(response, 401)

class signupRoute(Resource):
    def get(self):
        return {'get signup' : 'this is the signup get page'}
    def put(self):
        data = request.json["credentials"]
        email = data.get("email", None)
        username = data.get("username", None)
        password = data.get("password", None)
        error = None
        if not email:
            #email required
            error = 1
            response = jsonify({"msg": "Email required"})
            return make_response(response, 401)
        if not username:
            #username required
            error = 1
            response = jsonify({"msg": "Username required"})
            return make_response(response, 401)
        if not password:
            #password required
            error = 1
            response = jsonify({"msg": "Password required"})
            return make_response(response, 401)
        if error is None:
            exists = db.session.query(Users).filter_by(email=email).first() is not None
            if exists:
                #email address exists
                error = 1
                response = jsonify({"msg": "Email already exists"})
                return make_response(response, 401)
            else:
                usr = Users(username, email, password)
                db.session.add(usr)
                db.session.commit()
                response = jsonify({"success": "signup success"})
                return make_response(response, 200)

class protectedRoute(Resource):
    @jwt_required()
    def get(self):
        # Access the identity of the current user with get_jwt_identity
        current_user = get_jwt_identity()
        return make_response(jsonify(logged_in_as=current_user), 200)

class downloadEntriesRoute(Resource):
    @jwt_required()
    def get(self):
        data = {'message': "download entries get route"}
        return data, 200
    #TODO: adding jwt_required() causes a typeerror function is not serializable
    def put(self):
        # TODO: this may cause problems if multiple users
        # attempt download simultaneously, should make unique filename for sesssion
        print("line 458")
        csv_filename = "download_DKEntries.csv"
        csv_path = app.config['DOWNLOAD_FOLDER']
        fullPath = os.path.join(csv_path, csv_filename)
        if os.path.exists(fullPath):
            os.remove(fullPath)
        try:
            contest_id_data = request.get_json()
            contest_id = contest_id_data['contest_id']
            email_addr = contest_id_data['email']
            all_matching_contests = db.session.query(Entry).filter(
                            Entry.contest_id == contest_id,
                            Entry.email == email_addr
                    ).all()
            all_matching_contests_data = []
            if(all_matching_contests is not None):
                for contest in all_matching_contests:
                    contest_data = contest.__dict__
                    # Remove any internal keys
                    contest_data.pop('_sa_instance_state', None)
                    all_matching_contests_data.append(contest_data)
            build_csv_entry_file(all_matching_contests_data, fullPath)
            try:
                myFullPath = os.getcwd() + csv_path
                return send_from_directory(myFullPath, csv_filename, as_attachment=True)
            except FileNotFoundError:
                abort(404)
        except Exception as e:
            return {'message': 'Failed to build csv: {}'.format(str(e))}, 500

#data display route
class userContestDataRoute(Resource):
    @jwt_required()
    def get(self):
        data = {'message': "user contest data get route"}
        return data, 200
    @jwt_required()
    def put(self):
        #need to lint
        email_data = request.get_json()
        email_addr = email_data['email']
        myquery = db.session.query(distinct(Entry.contest_name),Entry.contest_id).filter(
                                    Entry.email == email_addr).all()
        contest_names_ids = []
        if myquery is not None:
            contest_names_ids = [{
                "contest_name": row[0],
                "contest_id": row[1],
            } for row in myquery]
        try:
            data =  {
                "message": "return message",
                "contest_list": contest_names_ids
                }
            return data, 200
        except Exception as e:
            return {"message": "Failed to retrieve contest data: {}".format(str(e))}, 500

class groupContestDataRoute(Resource):
    @jwt_required()
    def get(self):
        data = {'message': "groupContestDataRoute get route"}
        return data, 200
    def put(self):
        contest_id_data = request.get_json()
        contest_id = contest_id_data['contest_id']
        #data in: 
        # # {contestId: contest_id}
        # return:
        # [email1, email2, ... emailn]
        # [
        #   {entry dict...}
        # ]
        #TODO: Clean up this repeated code....
        email_list = []
        entry_query_list = []
        entry_obj_list = []
        emailQuery = db.session.query(distinct(Entry.email)).filter(Entry.contest_id == contest_id).all()
        if emailQuery is not None:
            email_list = [row[0] for row in emailQuery]
        for email in email_list:
            entry_query = db.session.query(Entry).filter(
                Entry.contest_id == contest_id,
                Entry.email == email
            ).all()
            if entry_query is not None:
                entry_query_list.extend(entry_query)
        if entry_query_list is not None:
                for entry_row in entry_query_list:
                    contest_data = entry_row.__dict__
                    # Remove any internal keys
                    if '_sa_instance_state' in contest_data:
                        contest_data.pop('_sa_instance_state', None)
                    entry_obj_list.append(contest_data)
        for lineup in entry_obj_list:
            print("****************")
            print("lineup: ")
            print(lineup)
            print("****************")
            #captain query
            contest_id_value = lineup['contest_id']
            lineup['_utility'] = []
            #add key _utility which is array of objects
            if lineup['captain'] != None:
                salary_array_query = db.session.query(Salary).filter(
                    Salary.player_id == lineup['captain'],
                    Salary.contest_id == contest_id_value
                        ).first()
                print("after captain query")
                if salary_array_query is not None:
                    salary_data = salary_array_query.__dict__
                    # Remove any internal keys
                    if '_sa_instance_state' in salary_data:
                        salary_data.pop('_sa_instance_state', None)
                        lineup['captain'] = salary_data
                    print(salary_data)
                    print("------------")
            if lineup['util_1'] != None:
                salary_array_query = db.session.query(Salary).filter(
                    Salary.player_id == lineup['util_1'],
                    Salary.contest_id == contest_id_value
                        ).first()
                if salary_array_query is not None:
                    salary_data = salary_array_query.__dict__
                    # Remove any internal keys
                    if '_sa_instance_state' in salary_data:
                        salary_data.pop('_sa_instance_state', None)
                        lineup['_utility'].append(salary_data)
                        del lineup['util_1']
            if lineup['util_2'] != None:
                salary_array_query = db.session.query(Salary).filter(
                    Salary.player_id == lineup['util_2'],
                    Salary.contest_id == contest_id_value
                        ).first()
                if salary_array_query is not None:
                    salary_data = salary_array_query.__dict__
                    # Remove any internal keys
                    if '_sa_instance_state' in salary_data:
                        salary_data.pop('_sa_instance_state', None)
                        lineup['_utility'].append(salary_data)
                        del lineup['util_2']
            if lineup['util_3'] != None:
                salary_array_query = db.session.query(Salary).filter(
                    Salary.player_id == lineup['util_3'],
                    Salary.contest_id == contest_id_value
                        ).first()
                if salary_array_query is not None:
                    salary_data = salary_array_query.__dict__
                    # Remove any internal keys
                    if '_sa_instance_state' in salary_data:
                        salary_data.pop('_sa_instance_state', None)
                        lineup['_utility'].append(salary_data)
                        del lineup['util_3']
            if lineup['util_4'] != None:
                salary_array_query = db.session.query(Salary).filter(
                    Salary.player_id == lineup['util_4'],
                    Salary.contest_id == contest_id_value
                        ).first()
                if salary_array_query is not None:
                    salary_data = salary_array_query.__dict__
                    # Remove any internal keys
                    if '_sa_instance_state' in salary_data:
                        salary_data.pop('_sa_instance_state', None)
                        lineup['_utility'].append(salary_data)
                        del lineup['util_4']
            if lineup['util_5'] != None:
                salary_array_query = db.session.query(Salary).filter(
                    Salary.player_id == lineup['util_5'],
                    Salary.contest_id == contest_id_value
                        ).first()
                if salary_array_query is not None:
                    salary_data = salary_array_query.__dict__
                    # Remove any internal keys
                    if '_sa_instance_state' in salary_data:
                        salary_data.pop('_sa_instance_state', None)
                        lineup['_utility'].append(salary_data)
                        del lineup['util_5']

        try:
            data =  {
                "message": "return message",
                "email_list": email_list,
                "entry_obj_list": entry_obj_list,
                }
            return data, 200
        except Exception as e:
            return {'message': 'Failed to retrieve groupContestDataRoute data: {}'.format(str(e))}, 500


class index_class(Resource):
    def get(self):
        return {"api-for-dk" : "index_page"}
#add resources
api.add_resource(index_class, '/api')
api.add_resource(salaries_route, '/api/salaries-route')
api.add_resource(entries_route, '/api/entries-route')
api.add_resource(loginRoute, '/api/login')
api.add_resource(protectedRoute, '/api/protected')
api.add_resource(signupRoute, '/api/signup')
api.add_resource(save_lint_entries_route, '/api/save-lint-entries-route')
api.add_resource(downloadEntriesRoute,'/api/download-entries-route')
api.add_resource(userContestDataRoute, '/api/user-contests-route')
api.add_resource(groupContestDataRoute, '/api/group-contests-route')
# api.add_resource(exampleRoute, '/api/example')