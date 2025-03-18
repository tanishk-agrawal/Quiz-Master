from flask import request, jsonify
from .models import *

from flask_security import auth_required, roles_required, roles_accepted

def create_routes(app):

    @app.route('/api/users', methods=['GET'])
    @auth_required('token')
    def get_users():
        users = User.query.all()
        return jsonify([{'id' : user.id, 'email' : user.email, 'username' : user.username} for user in users]), 200