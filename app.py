from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore

from application.config import config

from application import routes
from application import profile_routes
from application import quiz_routes

from application.models import db, User, Role
from application.initial_data import create_initial_data
from application.resources import api

from application.celery_init import celery_init_app

def create_app():
    app = Flask(__name__)
    
    config(app)
    db.init_app(app)

    with app.app_context():
        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        app.security = Security(app, user_datastore)
        
        db.create_all()
        create_initial_data(user_datastore)

    api.init_app(app)
    routes.create_routes(app, user_datastore)
    profile_routes.create_routes(app, user_datastore)
    quiz_routes.create_routes(app)

    return app


app = create_app()
celery = celery_init_app(app)

if __name__ == "__main__":
    app.run() 