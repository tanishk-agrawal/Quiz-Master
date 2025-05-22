from flask import request, jsonify
from .models import *

from flask_security import auth_required, roles_required,  current_user
from flask_security.utils import hash_password, verify_password

def create_routes(app, user_datastore):

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
