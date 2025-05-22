from flask_restful import Resource,  fields, reqparse, marshal
from flask_security import auth_required, roles_required, roles_accepted, current_user
from application.models import db, Subject


parser = reqparse.RequestParser()
parser.add_argument('name', type=str, required=True)
parser.add_argument('description', type=str)

subject_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String
}

class SubjectAPI(Resource):

    @auth_required('token')
    def get(self, subject_id=None):
        if subject_id:
            subject = Subject.query.get(subject_id)
            if not subject:
                return {'message': 'subject not found'}, 404
            data = marshal(subject, subject_fields) | {'number_of_chapters': len(subject.chapters)}
        else:
            subjects = Subject.query.all()
            if not subjects:
                return {'message': 'no subjects found'}, 404
            data = []
            for subject in subjects:
                data.append(marshal(subject, subject_fields) | {'number_of_chapters': len(subject.chapters)})
        return data, 200
    
    @auth_required('token')
    @roles_accepted('admin')
    def post(self):
        args = parser.parse_args()
        if args.name=="":
            return {'message': 'subject name cannot be empty'}, 400

        if Subject.query.filter_by(name=args.name).first():            
            return {'message': 'subject already exists'}, 409

        subject = Subject(name = args.name,
                          description = args.description)
        
        db.session.add(subject)
        db.session.commit()
        return {'message': 'subject created successfully'}, 201
    
    @auth_required('token')
    @roles_required('admin')
    def put(self, subject_id):
        subject = Subject.query.get(subject_id)
        if not subject:
            return {'message': 'subject not found'}, 404
        
        args = parser.parse_args()
        if args.name=="":
            return {'message': 'subject name cannot be empty'}, 400
        
        if subject.name!=args.name and Subject.query.filter_by(name=args.name).first():
            return {'message': 'subject already exists'}, 409
        
        subject.name = args.name
        subject.description = args.description
        db.session.commit()
        return {'message': 'subject updated successfully'}, 200
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, subject_id):
        subject = Subject.query.get(subject_id)
        if not subject:
            return {'message': 'subject not found'}, 404
        
        db.session.delete(subject)
        db.session.commit()
        return {'message': 'subject deleted successfully'}, 200
    

chapter_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'subject_id': fields.Integer
}

class SubjectChaptersAPI(Resource):

    @auth_required('token')
    def get(self, subject_id):
        subject = Subject.query.get(subject_id)
        if not subject:
            return {'message': 'subject not found'}, 404 
        chapter_list = []    
        for chapter in subject.chapters:
            n=0
            for quiz in chapter.quizzes:
                if current_user.roles[0].name == 'user' and quiz.show:
                    n+=1
            chapter_list.append(marshal(chapter, chapter_fields) | {'number_of_quizzes': n})   
        return marshal(subject, subject_fields) | {'chapters': chapter_list} , 200