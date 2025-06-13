from flask import request, jsonify
from flask_security import auth_required, roles_required, roles_accepted, current_user
from .models import *

from .func import *
from datetime import datetime, timedelta

def create_routes(app):

    @app.route('/api/quiz', methods=['POST'])
    @auth_required('token')
    @roles_required('admin')
    def create_quiz():
        data = request.get_json()
        name = data.get('name')
        instructions = data.get('instructions')
        time_limit_hhmm = data.get('time_limit_hhmm')
        scheduled_on = data.get('scheduled_on')
        chapter_id = data.get('chapter_id')

        if not name or not time_limit_hhmm or not chapter_id or not scheduled_on:
            return jsonify({"message" : "invalid input"}), 400
        
        time_limit = hhmm_to_minutes(time_limit_hhmm)
        if time_limit <= 0:
            return jsonify({"message" : "invalid time limit format"}), 400
                  
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return jsonify({"message" : "chapter not found"}), 404
        
        try:    
            new_quiz = Quiz(name = name, instructions = instructions, time_limit = time_limit, chapter_id = chapter_id,
                            scheduled_on = datetime.fromisoformat(scheduled_on),  created_on = datetime.now().replace(microsecond=0))
            db.session.add(new_quiz)
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
        scheduled_on = data.get('scheduled_on')

        print(data)
        if not name or not time_limit_hhmm or not scheduled_on:
            return jsonify({"message" : "invalid input"}), 400
        
        time_limit = hhmm_to_minutes(time_limit_hhmm)
        if time_limit <= 0:
            return jsonify({"message" : "invalid time limit format"}), 400
                  
                
        quiz.name = name
        quiz.instructions = instructions
        quiz.time_limit = time_limit
        quiz.scheduled_on = datetime.fromisoformat(scheduled_on)        

        db.session.commit() 
        return jsonify({'message' : 'quiz updated successfully'}), 200
    
    @app.route('/api/quiz/<int:id>/toggle-show', methods=['GET'])
    @auth_required('token')
    @roles_required('admin')
    def toggle_show(id):
        quiz = Quiz.query.get(id)
        if not quiz:
            return jsonify({"message" : "quiz not found"}), 404

        show = False if len(quiz.questions) == 0 else not quiz.show #False if there are no questions else toggle
        quiz.show = show
        db.session.commit() 
        print('show :', quiz.show)
        return jsonify({'message' : 'quiz updated successfully', 'show' : quiz.show}), 200
    

    @app.route('/api/question', methods=['POST'])
    @auth_required('token')
    @roles_required('admin')
    def create_question():
        data = request.get_json()
        statement = data.get('statement')
        hint = data.get('hint')
        marks = float(data.get('marks'))
        remark = data.get('remark')
        options = data.get('options') #list of options
        quiz_id = data.get('quiz_id')

        print(data)

        if not statement :
            return jsonify({"message" : "question statement is required"}), 400
        
        if len(options) < 2:
            return jsonify({"message" : "at least 2 options required"}), 400  

        for option in options:
            if not option["name"]:  
                return jsonify({"message" : "option cannot be empty"}), 400
        
        if  sum([option["is_correct"] for option in options]) != 1:
            return jsonify({"message" : "there should be exactly one correct option"}), 400
        
        if not marks or marks < 0:
            marks = 1
        
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return jsonify({"message" : "quiz not found"}), 404
        
        try:
            new_question = Question(statement = statement, hint = hint, marks = marks, remark = remark, quiz_id = quiz_id)
            db.session.add(new_question)
            db.session.commit() 
            print('question created '+ str(new_question.id))

            for option in options:
                new_option = Option(name = option["name"], is_correct = option["is_correct"], question_id = new_question.id)
                db.session.add(new_option)
                db.session.commit()
                print('option created '+ str(new_option.id))

        except Exception as e:
            print('error while creating', e)
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
        remark = data.get('remark')
        options = data.get('options') #list of options
        quiz_id = data.get('quiz_id')

        if not statement :
            return jsonify({"message" : "question statement is required"}), 400
        
        if len(options) < 2:
            return jsonify({"message" : "at least 2 options required"}), 400    
        
        for option in options:
            if not option["name"]:  
                return jsonify({"message" : "option cannot be empty"}), 400
        
        if  sum([option["is_correct"] for option in options]) != 1:
            return jsonify({"message" : "there should be exactly one correct option"}), 400
        
        if not marks or marks < 0:
            marks = 1
        
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return jsonify({"message" : "quiz not found"}), 404
        
        question.statement = statement
        question.hint = hint
        question.marks = marks
        question.remark = remark
        question.quiz_id = quiz_id

        for option in question.options:
            db.session.delete(option)
        
        for option in options:
            new_option = Option(name = option["name"], is_correct = option["is_correct"], question_id = question.id)
            db.session.add(new_option)
            db.session.commit()
            print('option created '+ str(new_option.id))

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
    

    @app.route('/api/quiz/get', methods=['GET'])
    @auth_required('token')
    def get_quiz():
        n = request.args.get('n', -1, type=int)
        if n >= 0:
            quizzes = Quiz.query.filter(Quiz.show == True).order_by(Quiz.scheduled_on).limit(n).all()
        else:
            quizzes = Quiz.query.filter(Quiz.show == True).order_by(Quiz.scheduled_on).all()

        if not quizzes:
            return jsonify({'message': 'no quizes found'}), 404      
        
        upcoming, past = [], []
        for quiz in quizzes:
            attempt = Attempt.query.filter(Attempt.user_id == current_user.id).filter(Attempt.quiz_id == quiz.id).first()
            result = {'attempted' : False}
            if attempt:
                percent = (attempt.marks_scored / attempt.max_marks) * 100
                result = {'attempted' : True, 'marks_scored': attempt.marks_scored, 'max_marks': attempt.max_marks, 'percentage': round(percent,1)}
            
            temp = {'id': quiz.id, 'name': quiz.name, 'instructions': quiz.instructions, 
                    'time_limit': quiz.time_limit, 'time_limit_hhmm': minutes_to_hhmm(quiz.time_limit), 'time_limit_formatted': minutes_to_formatted(quiz.time_limit),
                    'created_on': str(quiz.created_on), 'created_on_formatted': datetime_to_string(quiz.created_on), 
                    'scheduled_on_formatted': datetime_to_string(quiz.scheduled_on), 'scheduled_on': str(quiz.scheduled_on), 
                    'number_of_questions': len(quiz.questions), 'result': result,
                    'chapter' : {'id': quiz.chapter_id, 'name': quiz.chapter.name}, 
                    'subject': {'id': quiz.chapter.subject_id,  'name': quiz.chapter.subject.name}}
            if (quiz.scheduled_on + timedelta(minutes = quiz.time_limit)) < datetime.now():
                past.append(temp)
            else:
                upcoming.append(temp)
        return jsonify({'upcoming': upcoming, 'past': past}), 200
    
    @app.route('/api/chapter/<int:id>/quiz/user', methods=['GET'])
    @auth_required('token')
    def get_chapter_quiz(id):
        chapter = Chapter.query.get(id)
        if not chapter:
            return {'message': 'chapter not found'}, 404
        quizzes = []
        for quiz in chapter.quizzes:
            quizzes.append(quiz) if quiz.show else None

        if not quizzes:
            return jsonify({'message': 'no quizes found'}), 404      
        
        upcoming, past = [], []
        for quiz in quizzes:
            attempt = Attempt.query.filter(Attempt.user_id == current_user.id).filter(Attempt.quiz_id == quiz.id).first()
            result = {'attempted' : False}
            if attempt:
                percent = (attempt.marks_scored / attempt.max_marks) * 100
                result = {'attempted' : True, 'marks_scored': attempt.marks_scored, 'max_marks': attempt.max_marks, 'percentage': round(percent,1)}
            
            temp = {'id': quiz.id, 'name': quiz.name, 'instructions': quiz.instructions, 
                    'time_limit': quiz.time_limit, 'time_limit_hhmm': minutes_to_hhmm(quiz.time_limit), 'time_limit_formatted': minutes_to_formatted(quiz.time_limit),
                    'created_on': str(quiz.created_on), 'created_on_formatted': datetime_to_string(quiz.created_on), 
                    'scheduled_on_formatted': datetime_to_string(quiz.scheduled_on), 'scheduled_on': str(quiz.scheduled_on), 
                    'number_of_questions': len(quiz.questions), 'result': result,
                    'chapter' : {'id': quiz.chapter_id, 'name': quiz.chapter.name}, 
                    'subject': {'id': quiz.chapter.subject_id,  'name': quiz.chapter.subject.name}}
            if (quiz.scheduled_on + timedelta(minutes = quiz.time_limit)) < datetime.now():
                past.append(temp)
            else:
                upcoming.append(temp)
        return jsonify({'quizzes': upcoming + past}), 200

    @app.route('/api/quiz/<int:id>/user', methods=['GET'])
    @auth_required('token')
    def get_user_quiz(id):
        quiz = Quiz.query.get(id)
        if not quiz or not quiz.show:
            return jsonify({'message': 'quiz not found'}), 404
        quiz_attempt = Attempt.query.filter(Attempt.user_id == current_user.id).filter(Attempt.quiz_id == id).first()
        attempted = False if not quiz_attempt else True
        return {'id': quiz.id, 'name': quiz.name, 'instructions': quiz.instructions, 'time_limit': quiz.time_limit,
                              'time_limit_hhmm': minutes_to_hhmm(quiz.time_limit), 'time_limit_formatted': minutes_to_formatted(quiz.time_limit),
                              'created_on': str(quiz.created_on), 'created_on_formatted': datetime_to_string(quiz.created_on), 
                              'scheduled_on_formatted': datetime_to_string(quiz.scheduled_on), 'scheduled_on': str(quiz.scheduled_on), 
                              'number_of_questions': len(quiz.questions), 'total_marks' : sum(question.marks for question in quiz.questions),
                              'chapter' : {'id': quiz.chapter_id, 'name': quiz.chapter.name}, 
                              'subject': {'id': quiz.chapter.subject_id,  'name': quiz.chapter.subject.name}, 'attempted': attempted}, 200
    
    @app.route('/api/quiz/<int:id>/user/attempt', methods=['GET'])
    @auth_required('token')
    def get_user_attempt(id):
        quiz = Quiz.query.get(id)
        if not quiz or not quiz.show:
            return jsonify({'message': 'quiz not found'}), 404
        
        if quiz.scheduled_on > datetime.now():
            return jsonify({'message': 'quiz not started yet'}), 404
        
        if not (quiz.scheduled_on <= datetime.now() <= (quiz.scheduled_on + timedelta(minutes = quiz.time_limit))):
            return jsonify({'message': 'quiz can be attempted only in scheduled time'}), 404
        
        quiz_attempt = Attempt.query.filter(Attempt.user_id == current_user.id).filter(Attempt.quiz_id == id).first()
        attempted = False if not quiz_attempt else True

        questions = []
        for question in quiz.questions:
            options = []
            for option in question.options:
                options.append({'id': option.id, 'name': option.name})
                
            questions.append({'id': question.id, 'statement': question.statement, 'hint': question.hint, 'marks': question.marks, 
                              'options': options})

        return {'id': quiz.id, 'name': quiz.name, 'instructions': quiz.instructions, 'time_limit': quiz.time_limit,
                              'time_limit_hhmm': minutes_to_hhmm(quiz.time_limit), 'time_limit_formatted': minutes_to_formatted(quiz.time_limit),
                              'created_on': str(quiz.created_on), 'created_on_formatted': datetime_to_string(quiz.created_on), 
                              'scheduled_on_formatted': datetime_to_string(quiz.scheduled_on), 'scheduled_on': str(quiz.scheduled_on),  
                              'number_of_questions': len(quiz.questions), 'total_marks' : sum(question.marks for question in quiz.questions),
                              'questions': questions,   
                              'chapter' : {'id': quiz.chapter_id, 'name': quiz.chapter.name}, 
                              'subject': {'id': quiz.chapter.subject_id,  'name': quiz.chapter.subject.name}, 'attempted': attempted}, 200
    
    @app.route('/api/quiz/<int:id>/user/attempt', methods=['POST'])
    @auth_required('token')
    def create_user_attempt(id):
        quiz = Quiz.query.get(id)
        if not quiz or not quiz.show:
            return jsonify({'message': 'quiz not found'}), 404
        
        data = request.get_json()
        print(data)
        started_at = data.get('started_at')
        submissions = data.get('submissions') # {'question_id': 'selected_option_id', ...}

        if not started_at or not submissions:
            return jsonify({'message': 'started_at and submissions are required'}), 400
        
        if not (quiz.scheduled_on <= datetime.strptime(started_at, "%d/%m/%Y, %H:%M:%S") <= (quiz.scheduled_on + timedelta(minutes = quiz.time_limit))):
            return jsonify({'message': 'quiz can be attempted only in scheduled time'}), 400

        for question_id, option_id in submissions.items():
            question_id = int(question_id)

            question = Question.query.filter(Question.id == question_id).first()
            if question.quiz.id != quiz.id:
                return jsonify({'message': 'question not found'}), 400
            
            if option_id and option_id not in [option.id for option in question.options]:
                return jsonify({'message': 'option not found'}), 400

        max_marks = sum(question.marks for question in quiz.questions)
        attempt = Attempt(quiz_id = quiz.id, user_id = current_user.id, started_at = datetime.strptime(started_at, "%d/%m/%Y, %H:%M:%S"), submitted_at = datetime.now().replace(microsecond=0), max_marks = max_marks)
        db.session.add(attempt)
        db.session.commit() 

        for question_id, option_id in submissions.items():
            question_id = int(question_id)
            question = Question.query.filter(Question.id == question_id).first()
            is_correct = False
            if option_id:
                option = Option.query.filter(Option.id == option_id).first()
                is_correct = option.is_correct

            marks = question.marks if is_correct else 0

            score = Score(question_id = question_id, attempt_id = attempt.id, selected_option_id = option_id, is_correct = is_correct, marks = marks)
            db.session.add(score)
            db.session.commit() 

        attempt.marks_scored = sum(score.marks for score in attempt.scores)
        db.session.commit()

        return {'message': 'attempt created successfully'}, 201
    
    @app.route('/api/quiz/<int:id>/user/result', methods=['GET'])
    @auth_required('token')
    def get_user_result(id):
        quiz = Quiz.query.get(id)
        if not quiz or not quiz.show:
            return jsonify({'message': 'quiz not found'}), 404
        
        attempt = Attempt.query.filter(Attempt.user_id == current_user.id).filter(Attempt.quiz_id == id).first()
        if not attempt:
            return jsonify({'message': 'attempt not found'}), 404
        
        percent = (attempt.marks_scored / attempt.max_marks) * 100

        scores = []
        for score in attempt.scores:
            options = []
            for option in score.question.options:
                options.append({'id': option.id, 'name': option.name, 'is_correct': option.is_correct, 'is_selected': option.id == score.selected_option_id})
            
                
            scores.append({'id': score.question.id, 'statement': score.question.statement, 'hint': score.question.hint, 'marks': score.question.marks, 
                              'options': options,  'remark': score.question.remark, 'selected_option_id': score.selected_option_id, 'is_correct': score.is_correct, 'marks_scored': score.marks})


        return {'id': attempt.id, 'quiz': {'id': quiz.id, 'name': quiz.name, 
                                           'chapter': {'id': quiz.chapter_id, 'name': quiz.chapter.name}, 
                                           'subject': {'id': quiz.chapter.subject_id, 'name': quiz.chapter.subject.name}}, 
                'marks_scored': attempt.marks_scored, 'max_marks': attempt.max_marks, 'percentage': round(percent,1), 'questions': scores}, 200
    
    @app.route('/api/user/history', methods=['GET'])
    @auth_required('token')
    def get_user_history():
        attempts = Attempt.query.filter(Attempt.user_id == current_user.id).order_by(Attempt.submitted_at.desc()).all()
        if not attempts:
            return jsonify({'message': 'no attempts found'}), 404

        list = []
        for attempt in attempts:
            percent = (attempt.marks_scored / attempt.max_marks) * 100
            quiz = {'id': attempt.quiz_id, 'name': attempt.quiz.name, 
                    'chapter': {'id': attempt.quiz.chapter_id, 'name': attempt.quiz.chapter.name}, 
                    'subject': {'id': attempt.quiz.chapter.subject_id, 'name': attempt.quiz.chapter.subject.name}}
            list.append({'id': attempt.id, 'quiz': quiz, 'marks_scored': attempt.marks_scored, 'max_marks': attempt.max_marks, 'percentage': round(percent,1),
                          'submitted_at': datetime_to_string(attempt.submitted_at), 'started_at': datetime_to_string(attempt.started_at)})
            
        return  list, 200