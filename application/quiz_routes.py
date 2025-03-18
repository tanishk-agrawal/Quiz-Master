from flask import request, jsonify
from flask_security import auth_required, roles_required, roles_accepted
from .models import *

from .func import hhmm_to_minutes
from datetime import datetime

def create_routes(app):

    @app.route('/api/quiz', methods=['POST'])
    @auth_required('token')
    @roles_required('admin')
    def create_quiz():
        data = request.get_json()
        name = data.get('name')
        instructions = data.get('instructions')
        time_limit_hhmm = data.get('time_limit_hhmm')
        deadline = data.get('deadline')
        chapter_id = data.get('chapter_id')

        if not name or not time_limit_hhmm or not chapter_id:
            return jsonify({"message" : "invalid input"}), 400
        
        time_limit = hhmm_to_minutes(time_limit_hhmm)
        if time_limit <= 0:
            return jsonify({"message" : "invalid time limit format"}), 400
                  
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return jsonify({"message" : "chapter not found"}), 404
        
        try:    
            new_quiz = Quiz(name = name, instructions = instructions, time_limit = time_limit, chapter_id = chapter_id, show = False, created_on = datetime.now())
            db.session.add(new_quiz)
            if deadline:
                dline = datetime.fromisoformat(deadline)
                new_quiz.deadline = dline
            db.session.commit() 
            print('quiz created '+ str(new_quiz.id))
        except:
            print('error while creating')
            db.session.rollback()
            return jsonify({'message' : 'error while creating quiz'}), 408
        
        return jsonify({'message' : 'quiz created successfully'}), 200
    

    @app.route('/api/quiz/<int:id>', methods=['POST'])
    @auth_required('token')
    @roles_required('admin')
    def update_quiz(id):
        quiz = Quiz.query.get(id)
        if not quiz:
            return jsonify({"message" : "quiz not found"}), 404

        data = request.get_json()
        name = data.get('name')
        instructions = data.get('instructions')
        time_limit_hhmm = data.get('time_limit_hhmm')
        deadline = data.get('deadline')
        chapter_id = data.get('chapter_id')

        if not name or not time_limit_hhmm or not chapter_id:
            return jsonify({"message" : "invalid input"}), 400
        
        time_limit = hhmm_to_minutes(time_limit_hhmm)
        if time_limit <= 0:
            return jsonify({"message" : "invalid time limit format"}), 400
                  
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return jsonify({"message" : "chapter not found"}), 404
        
        quiz.name = name
        quiz.instructions = instructions
        quiz.time_limit = time_limit
        quiz.chapter_id = chapter_id
        if deadline:
            dline = datetime.fromisoformat(deadline)
            quiz.deadline = dline
        else:
            quiz.deadline = None

        db.session.commit() 
        return jsonify({'message' : 'quiz updated successfully'}), 200
    
    

    @app.route('/api/question', methods=['POST'])
    @auth_required('token')
    @roles_required('admin')
    def create_question():
        data = request.get_json()
        statement = data.get('statement')
        hint = data.get('hint')
        marks = float(data.get('marks'))
        option_a = data.get('option_a')
        option_b = data.get('option_b')
        option_c = data.get('option_c')
        option_d = data.get('option_d')
        answer = data.get('answer').upper()
        remark = data.get('remark')
        quiz_id = data.get('quiz_id')

        if not statement or not option_a or not option_b:
            return jsonify({"message" : "invalid input"}), 400
        
        
        if not answer or answer not in list('ABCD'):
            return jsonify({"message" : "invalid answer"}), 400
        
        if not option_c and answer =='C':
            return jsonify({"message" : "invalid answer"}), 400        
        if not option_d and answer =='D':
            return jsonify({"message" : "invalid answer"}), 400
        
        if not marks or marks < 0:
            marks = 1
        
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return jsonify({"message" : "quiz not found"}), 404
        
        try:
            new_question = Question(statement = statement, hint = hint, marks = marks, option_a = option_a, option_b = option_b, option_c = option_c, option_d = option_d, answer = answer, remark = remark, quiz_id = quiz_id)
            db.session.add(new_question)
            db.session.commit() 
            print('question created '+ str(new_question.id))

            quiz.show = True
            db.session.commit()
        except:
            print('error while creating')
            db.session.rollback()
            return jsonify({'message' : 'error while creating question'}), 408
        
        return jsonify({'message' : 'question created successfully'}), 200
    

    @app.route('/api/question/<int:id>', methods=['POST'])
    @auth_required('token')
    @roles_required('admin')
    def update_question(id):
        question = Question.query.get(id)
        if not question:
            return jsonify({"message" : "question not found"}), 404

        data = request.get_json()
        statement = data.get('statement')
        hint = data.get('hint')
        marks = float(data.get('marks'))
        option_a = data.get('option_a')
        option_b = data.get('option_b')
        option_c = data.get('option_c')
        option_d = data.get('option_d')
        answer = data.get('answer').upper()
        remark = data.get('remark')
        quiz_id = data.get('quiz_id')

        if not statement or not option_a or not option_b:
            return jsonify({"message" : "invalid input"}), 400
        
        
        if not answer or answer not in list('ABCD'):
            return jsonify({"message" : "invalid answer"}), 400
        
        if not option_c and answer =='C':
            return jsonify({"message" : "invalid answer"}), 400        
        if not option_d and answer =='D':
            return jsonify({"message" : "invalid answer"}), 400
        
        if not marks or marks < 0:
            marks = 1
        
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return jsonify({"message" : "quiz not found"}), 404
        
        question.statement = statement
        question.hint = hint
        question.marks = marks
        question.option_a = option_a
        question.option_b = option_b
        question.option_c = option_c
        question.option_d = option_d
        question.answer = answer
        question.remark = remark
        question.quiz_id = quiz_id

        db.session.commit() 
        return jsonify({'message' : 'question updated successfully'}), 200
    

    @app.route('/api/question/<int:id>', methods=['DELETE'])
    @auth_required('token')
    @roles_required('admin')
    def remove_question(id):
        question = Question.query.get(id)
        if not question:
            return jsonify({"message" : "question not found"}), 404
        
        if len(question.quiz.questions) == 1:
            question.quiz.show = False
        
        db.session.delete(question)
        db.session.commit()
        return jsonify({'message' : 'question deleted successfully'}), 200