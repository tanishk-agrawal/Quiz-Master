from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore

from application.config import config
from application import routes


def create_app():
    app = Flask(__name__)
    
    config(app)
    # db.init_app(app)

    # with app.app_context():
        # from models import User, Role
        # from flask_security import SQLAlchemyUserDatastore

        # user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        # security.init_app(app, user_datastore)
        
        # db.create_all()
        # create_initial_data.create_data(user_datastore)


    # views.create_views(app, user_datastore)
    # resources.api.init_app(app)
    routes.create_routes(app)
    return app

if __name__ == "__main__":
    app =create_app()
    app.run(debug=True) 