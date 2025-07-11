from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore
from flask_caching import Cache

from application.config import config

from application import routes
from application import profile_routes
from application import quiz_routes

from application.models import db, User, Role
from application.initial_data import create_initial_data
from application.resources import api

from application.celery_init import celery_init_app
from celery.schedules import crontab

from application.tasks import daily_reminder, monthly_report

def create_app():
    app = Flask(__name__)
    
    config(app)
    db.init_app(app)

    with app.app_context():
        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        app.security = Security(app, user_datastore)
        
        db.create_all()
        create_initial_data(user_datastore)

    cache = Cache(app)

    api.init_app(app)
    routes.create_routes(app, user_datastore)
    profile_routes.create_routes(app, user_datastore)
    quiz_routes.create_routes(app, cache)

    return app


app = create_app()
celery = celery_init_app(app)
celery.autodiscover_tasks()

@celery.on_after_finalize.connect 
def setup_periodic_tasks(sender, **kwargs):

    #Daily reminder
    sender.add_periodic_task(30.0, daily_reminder.s()) #for testing
    # sender.add_periodic_task(crontab(minute=0, hour=18), daily_reminder.s()) #send daily at 6pm

    #Monthly report
    sender.add_periodic_task(45.0, monthly_report.s()) #for testing
    # sender.add_periodic_task(crontab(0, 0, day_of_month=1), monthly_report.s()) #send 1st of every month

if __name__ == "__main__":
    app.run() 