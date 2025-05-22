from flask_restful import Resource,  fields, reqparse, marshal
from flask_security import auth_required, roles_required, roles_accepted, current_user
from application.models import db, Subject, Chapter


parser = reqparse.RequestParser()
parser.add_argument('name', type=str, required=True)
parser.add_argument('description', type=str)
parser.add_argument('subject_id', type=int, required=True)

chapter_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'subject_id': fields.Integer
}

class ChapterAPI(Resource):

    @auth_required('token')
    def get(self, chapter_id=None):
        if chapter_id:
            chapter = Chapter.query.get(chapter_id)
            if not chapter:
                return {'message': 'chapter not found'}, 404
        else:
            chapter = Chapter.query.all()
            if not chapter:
                return {'message': 'no chapters found'}, 404
        return marshal(chapter, chapter_fields)
    
    @auth_required('token')
    @roles_required('admin')
    @roles_accepted('admin')
    def post(self):
        args = parser.parse_args()
        if args.name=="":
            return {'message': 'chapter name cannot be empty'}, 400
        if not args.subject_id:
            return {'message': 'subject id cannot be empty'}, 400

        if Chapter.query.filter_by(name=args.name).first():            
            return {'message': 'chapter already exists'}, 409
        if not Subject.query.get(args.subject_id):
            return {'message': 'invalid subject id'}, 400
        
        chapter = Chapter(name = args.name,
                          description = args.description,
                          subject_id = args.subject_id)
        
        db.session.add(chapter)
        db.session.commit()
        return {'message': 'chapter created successfully'}, 201
    
    @auth_required('token')
    @roles_required('admin')
    def put(self, chapter_id):
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return {'message': 'chapter not found'}, 404
        
        args = parser.parse_args()
        if args.name=="":
            return {'message': 'chapter name cannot be empty'}, 400
        if not args.subject_id:
            return {'message': 'subject id cannot be empty'}, 400

        if chapter.name!=args.name and Chapter.query.filter_by(name=args.name).first():
            return {'message': 'chapter already exists'}, 409
        if not Subject.query.get(args.subject_id):
            return {'message': 'invalid subject id'}, 400
        
        chapter.name = args.name
        chapter.description = args.description
        chapter.subject_id = args.subject_id
        db.session.commit()
        return {'message': 'chapter updated successfully'}, 200
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, chapter_id):
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return {'message': 'chapter not found'}, 404
        
        db.session.delete(chapter)
        db.session.commit()
        return {'message': 'chapter deleted successfully'}, 200
    
from application.func import *

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
class ChapterQuizzesAPI(Resource):
    @auth_required('token')
    def get(self, chapter_id):
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return {'message': 'chapter not found'}, 404
        quizzes = chapter.quizzes
        quiz_list = []
        for quiz in quizzes:
            if current_user.roles[0].name == 'user' and not quiz.show:
                continue
            
            deadline = quiz.deadline.strftime("%d/%m/%Y %I:%M%p") if quiz.deadline else None
            quiz_list.append(marshal(quiz, quiz_fields)|{'deadline_formatted': deadline, 'number_of_questions': len(quiz.questions), 
                                                         'time_limit_hhmm': minutes_to_hhmm(quiz.time_limit), 'time_limit_formatted': minutes_to_formatted(quiz.time_limit),})
        return marshal(chapter, chapter_fields) | {'subject_name': chapter.subject.name, 'quizzes': quiz_list}, 200