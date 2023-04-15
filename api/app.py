#!/usr/bin/env python3
import os
from application import create_app, db
from flask_restful import Api
#todo all errors must have session["error"] message
#basedir = os.path.abspath(os.path.dirname(__file__))

#Database + config
# sudo service mysql restart / start
# mysql -u root -p
# none
# show databases;
# use _DB_NAME;

#add routes
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)