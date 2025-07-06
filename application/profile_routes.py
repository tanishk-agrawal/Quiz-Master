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
    
       
    @app.route('/api/user-performance', methods=['GET'])
    @auth_required('token')
    @roles_required('admin')
    def get_all_user_performance():
        users = User.query.filter(User.roles.any(name='user')).all()
        if not users:
            return jsonify({'message' : 'no users found'}), 404
        performance = []
        for user in users:
            dict = {'user_id': user.id, 'email' : user.email, 'username' : user.username, 'scores': []}
            
            for attempt in user.attempts:
                dict['scores'].append((attempt.marks_scored/attempt.max_marks)*100)
                
            dict['no_of_quizzes'] = len(dict['scores'])
            dict['average'] = round(sum(dict['scores'])/dict['no_of_quizzes'], 1) if dict['no_of_quizzes'] > 0 else 0
                        
            performance.append(dict)
        return jsonify(performance), 200
    
    @app.route('/api/user-performance/<user_id>', methods=['GET'])
    @auth_required('token')
    def get_user_performance(user_id):
        if current_user.roles[0].name != 'admin' or current_user.id != user_id: #user can only access their own performance / RBAC?
            return jsonify({'message' : 'unauthorized'}), 403

        user = User.query.filter(User.id == user_id).first()
        if not user or user.roles[0].name != 'user': 
            return jsonify({'message' : 'user not found'}), 404
        
        dict = {'user_id': user.id, 'email' : user.email, 'username' : user.username, 'subjects': [], 'scores': []}
        for attempt in user.attempts:
            dict['scores'].append(attempt.marks_scored/attempt.max_marks)
            f1, f2 = False, False
            for subject in dict['subjects']:
                if subject['name'] == attempt.quiz.chapter.subject.name:
                    f1 = True
                    subject['scores'].append(attempt.marks_scored/attempt.max_marks)
                    for chapter in subject['chapters']:
                        if chapter['name'] == attempt.quiz.chapter.name:
                            f2 = True
                            chapter['scores'].append(attempt.marks_scored/attempt.max_marks)
                            break
                    if not f2:
                        subject['chapters'].append({'name': attempt.quiz.chapter.name, 'scores': [attempt.marks_scored/attempt.max_marks]})
                    break
            if not f1:
                dict['subjects'].append({'name': attempt.quiz.chapter.subject.name, 'scores': [attempt.marks_scored/attempt.max_marks], 
                                            'chapters': [{'name': attempt.quiz.chapter.name, 'scores': [attempt.marks_scored/attempt.max_marks]}]})
        
        dict['no_of_quizzes'] = len(dict['scores']) 
        dict['average'] = sum(dict['scores'])/dict['no_of_quizzes'] if dict['no_of_quizzes'] > 0 else 0
        for subject in dict['subjects']:
            subject['no_of_quizzes'] = len(subject['scores'])
            subject['average'] = sum(subject['scores'])/subject['no_of_quizzes'] if subject['no_of_quizzes'] > 0 else 0
            for chapter in subject['chapters']:
                chapter['no_of_quizzes'] = len(chapter['scores'])
                chapter['average'] = sum(chapter['scores'])/chapter['no_of_quizzes'] if chapter['no_of_quizzes'] > 0 else 0

        return jsonify(dict), 200

    @app.route('/api/user-subject-performance', methods=['GET'])
    @auth_required('token')
    def get_subject_performance():        
        user = current_user        
        dict = {'user_id': user.id, 'email' : user.email, 'username' : user.username, 'subjects': []}
        for attempt in user.attempts:
            f1 = False
            for subject in dict['subjects']:
                if subject['name'] == attempt.quiz.chapter.subject.name:
                    f1 = True
                    subject['scores'].append((attempt.marks_scored/attempt.max_marks)*100)
                    break
            if not f1:
                dict['subjects'].append({'name': attempt.quiz.chapter.subject.name, 'scores': [(attempt.marks_scored/attempt.max_marks)*100]})

        for subject in dict['subjects']:
            subject['no_of_quizzes'] = len(subject['scores'])
            subject['average'] = round(sum(subject['scores'])/subject['no_of_quizzes'], 1) if subject['no_of_quizzes'] > 0 else 0
        
        return jsonify(dict), 200
    

    @app.route('/api/user-bubble-data', methods=['GET'])
    @auth_required('token')
    def get_user_bubble_data():        
        user = current_user 
        attempts = Attempt.query.filter(Attempt.user_id == user.id).all()

        data = []
        for attempt in attempts:
            time_taken = (attempt.submitted_at - attempt.started_at).total_seconds() / 60  
            percent = (attempt.marks_scored / attempt.max_marks) * 100
            ques_attempted = len([score for score in attempt.scores if score.selected_option_id is not None]) 

            data.append({
                'x': round(time_taken, 2),
                'y': round(percent, 2),
                'r': min(15, max(5, ques_attempted)),
                'quiz' : attempt.quiz.name,
                'no_of_ques' : ques_attempted
            })
           
        return jsonify(data), 200