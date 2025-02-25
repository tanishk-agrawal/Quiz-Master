from flask import render_template, request, jsonify
from flask_security import auth_required, roles_required, roles_accepted, SQLAlchemyUserDatastore, current_user
from flask_security.utils import hash_password, verify_password

from .models import *

def create_routes(app, user_datastore : SQLAlchemyUserDatastore):

    @app.route('/')
    def home():
        return render_template('index.html')
    
    @app.route('/api/login', methods=['POST'])
    def user_login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message' : 'email or password not provided'}), 400
        
        user = user_datastore.find_user(email = email)
        if not user:
            return jsonify({'message' : 'user not found'}), 404
        
        if verify_password(password, user.password):
            return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'username' : user.username, 'role' : user.roles[0].name}), 200
        else :
            return jsonify({'message' : 'invalid password'}), 400
        
    @app.route('/api/signup', methods=['POST'])
    def signup():
        data = request.get_json()
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        if not email or not username or not password:
            return jsonify({"message" : "invalid input"}), 400
        
        if user_datastore.find_user(email=email):
            return jsonify({"message" : "user already exists"}), 409
        
        try:    
            user_datastore.create_user(email = email, username = username, password = hash_password(password), roles=['user'])
            db.session.commit() 
        except:
            print('error while creating')
            db.session.rollback()
            return jsonify({'message' : 'error while creating user'}), 408
        
        return jsonify({'message' : 'user created successfully'}), 200