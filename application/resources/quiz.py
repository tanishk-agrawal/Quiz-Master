from flask_restful import Resource,  fields, marshal
from flask_security import auth_required, roles_required, roles_accepted, current_user
from application.models import db, Quiz
from application.func import *

quiz_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'instructions': fields.String,
    'time_limit': fields.Integer,
    'created_on': fields.String,
    'scheduled_on': fields.String,
    'show': fields.Boolean,
    'chapter_id': fields.Integer
}

class QuizAPI(Resource):
    @auth_required('token')
    def get(self, quiz_id=None):
        if quiz_id:
            quiz = Quiz.query.get(quiz_id)
            if current_user.roles[0].name == 'user' and not quiz.show:
                quiz = None
            if not quiz:
                return {'message': 'quiz not found'}, 404
            data = marshal(quiz, quiz_fields)|{'number_of_questions': len(quiz.questions), 'time_limit_hhmm': minutes_to_hhmm(quiz.time_limit)}
        else:
            quizzes = Quiz.query.all()
            if not quizzes:
                return {'message': 'no quizes found'}, 404
            data = []
            for quiz in quizzes:
                if current_user.roles[0].name == 'user' and not quiz.show:
                    continue
                data.append(marshal(quiz, quiz_fields)|{'number_of_questions': len(quiz.questions), 'time_limit_hhmm': minutes_to_hhmm(quiz.time_limit)})
        return data, 200
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {'message': 'quiz not found'}, 404
        
        db.session.delete(quiz)
        db.session.commit()
        return {'message': 'quiz deleted successfully'}, 200
    


ques_fields = {
    'id': fields.Integer,
    'statement': fields.String,
    'hint': fields.String,
    'marks': fields.Float,
    'remark': fields.String,
    'quiz_id': fields.Integer
}

opt_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'is_correct': fields.Boolean,
    'question_id': fields.Integer
}

class QuizQuestionsAPI(Resource):
    @auth_required('token')
    def get(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        
        if not quiz:
            return {'message': 'quiz not found'}, 404
        questions = []
        for question in quiz.questions:            
            for i in range(len(question.options)):
                if question.options[i].is_correct:
                    correct_option = i+1 
                    break
            questions.append(marshal(question, ques_fields)|{'options': marshal(question.options, opt_fields), 'correct_option': correct_option})
        return marshal(quiz, quiz_fields)|{'time_limit_hhmm': minutes_to_hhmm(quiz.time_limit), 
                                           'time_limit_formatted': minutes_to_formatted(quiz.time_limit),
                                           'created_on_formatted': datetime_to_string(quiz.created_on),
                                           'scheduled_on_formatted': datetime_to_string(quiz.scheduled_on),
                                                       'chapter_id' : quiz.chapter.id,
                                                       'chapter_name' : quiz.chapter.name,
                                                       'subject_id' : quiz.chapter.subject.id,
                                                       'subject_name' : quiz.chapter.subject.name,
                                                       'number_of_questions': len(quiz.questions), 
                                                       'questions': questions}, 200