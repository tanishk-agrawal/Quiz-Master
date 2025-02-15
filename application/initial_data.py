from flask_security import SQLAlchemySessionUserDatastore
from flask_security.utils import hash_password
from .models import db

def create_initial_data(user_datastore : SQLAlchemySessionUserDatastore):  
    #roles
    user_datastore.find_or_create_role(name='admin', description = "Administrator")
    user_datastore.find_or_create_role(name='user', description = "General User")

    #initial data
    if not user_datastore.find_user(email = "admin@email.com"):
        user_datastore.create_user(email = "admin@email.com", username = "admin", password = hash_password("pass"), roles=['admin'])
    
    if not user_datastore.find_user(email = "user@email.com"):
        user_datastore.create_user(email = "user@email.com", username = "user01", password = hash_password("pass"), roles=['user'])

    db.session.commit()