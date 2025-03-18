from flask_restful import Resource,  fields, marshal
from flask_security import auth_required, roles_required
from application.models import db, Quiz
from application.func import minutes_to_hhmm

quiz_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'instructions': fields.String,
    'time_limit': fields.Integer,
    'show': fields.Boolean,
    'created_on': fields.String,
    'deadline': fields.String,
    'chapter_id': fields.Integer
}

class QuizAPI(Resource):
    @auth_required('token')
    def get(self, quiz_id=None):
        if quiz_id:
            quiz = Quiz.query.get(quiz_id)
            if not quiz:
                return {'message': 'quiz not found'}, 404
            data = marshal(quiz, quiz_fields)|{'number_of_questions': len(quiz.questions), 'time_limit_hhmm': minutes_to_hhmm(quiz.time_limit)}
        else:
            quizzes = Quiz.query.all()
            if not quizzes:
                return {'message': 'no quizes found'}, 404
            data = []
            for quiz in quizzes:
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
    'option_a': fields.String,
    'option_b': fields.String,
    'option_c': fields.String,
    'option_d': fields.String,
    'answer': fields.String,
    'remark': fields.String,
    'quiz_id': fields.Integer
}

class QuizQuestionsAPI(Resource):
    @auth_required('token')
    def get(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {'message': 'quiz not found'}, 404
        return marshal(quiz, quiz_fields)|{'time_limit_hhmm': minutes_to_hhmm(quiz.time_limit), 
                                                       'chapter_name' : quiz.chapter.name,
                                                       'subject_id' : quiz.chapter.subject.id,
                                                       'subject_name' : quiz.chapter.subject.name,
                                                       'number_of_questions': len(quiz.questions), 
                                                       'questions': marshal(quiz.questions, ques_fields)}, 200