from flask import render_template, redirect, request, jsonify, send_file
from flask_security import auth_required, roles_required, roles_accepted, current_user
from flask_security.utils import hash_password, verify_password, login_user, logout_user
from celery.result import AsyncResult
from .models import *
from .tasks import *

import datetime

def create_routes(app, user_datastore):

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
            login_user(user)
            user.last_login = datetime.datetime.now()
            db.session.commit()
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
            return jsonify({"message" : "account with email already exists"}), 409
        
        if user_datastore.find_user(username=username):
            return jsonify({"message" : "username already exists"}), 409
        
        try:    
            user_datastore.create_user(email = email, username = username, password = hash_password(password), roles=['user'])
            db.session.commit() 
        except:
            print('error while creating')
            db.session.rollback()
            return jsonify({'message' : 'error while creating user'}), 408
        
        return jsonify({'message' : 'user created successfully'}), 200
    
    @app.route('/api/logout')
    @auth_required('token')
    def user_logout():
        logout_user()
        return jsonify({'message' : 'user logged out successfully'}), 200
    
    @app.route('/api/users', methods=['GET'])
    @auth_required('token')
    @roles_required('admin')
    def get_users():
        users = User.query.all()
        return jsonify([{'id' : user.id, 'email' : user.email, 'username' : user.username, 'role' : user.roles[0].name} for user in users]), 200
    

    @app.route('/api/profile', methods=['GET'])
    @auth_required('token')
    def get_profile():
        return jsonify({'email' : current_user.email, 'username' : current_user.username, 'role' : current_user.roles[0].name}), 200
    
    @app.route('/api/profile', methods=['POST'])
    @auth_required('token')
    def update_profile():
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({"message" : "invalid input"}), 400        

        if password and not verify_password(password, current_user.password):
            return jsonify({"message" : "invalid password"}), 400
        
        if email and email != current_user.email and user_datastore.find_user(email = email):
            return jsonify({"message" : "account with email already exists"}), 409
        
        if username and username != current_user.username and user_datastore.find_user(username = username):
            return jsonify({"message" : "username already exists"}), 409

        current_user.username = username
        db.session.commit()
        return jsonify({'message' : 'profile updated successfully'}), 200
    
    @app.route('/api/change-password', methods=['POST'])
    @auth_required('token')
    def change_password():
        data = request.get_json()
        password = data.get('password')
        new_password = data.get('new_password')

        if not password or not new_password:
            return jsonify({"message" : "invalid input"}), 400        

        if not verify_password(password, current_user.password):
            return jsonify({"message" : "invalid password"}), 400
        
        if password == new_password:
            return jsonify({"message" : "new password same as old password"}), 400
        
        current_user.password = hash_password(new_password)
        db.session.commit()
        return jsonify({'message' : 'password changed successfully'}), 200
    
    @app.route('/api/export-csv') 
    @auth_required('token')
    @roles_required('user')
    def export_csv():
        result = generate_user_history_csv.delay(current_user.id) 
        return jsonify({
            "id": result.id,
            "result": result.result,

        })    
    
    ## Async tasks
    @app.route('/api/export-csv/all') 
    @auth_required('token')
    @roles_required('admin')
    def export_all_csv():
        result = generate_users_performance_csv.delay() 
        return jsonify({
            "id": result.id,
            "result": result.result,

        })
    @app.route('/api/get-csv/<id>') 
    @auth_required('session')
    def get_csv(id):
        result = AsyncResult(id)
        if not result.ready():
            return redirect('/#/')
        return send_file('static/csv/' + result.result, as_attachment=True)
    
    @app.route('/api/is-ready/<id>') 
    @auth_required('session')
    def is_ready(id):
        result = AsyncResult(id)
        return {'ready': result.ready()}
    

    # for testing 
    #
    # @app.route('/api/mail')
    # def mail():
    #     result = daily_reminder.delay() 
    #     return jsonify({
    #         "id": result.id,
    #         "result": result.result,
    #     })
    
    # @app.route('/api/mail-report')
    # def mail_report():
    #     result = monthly_report.delay() 
    #     return jsonify({
    #         "id": result.id,
    #         "result": result.result,
    #     })