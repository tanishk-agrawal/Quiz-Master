from flask_restful import Resource,  fields, reqparse, marshal
from flask_security import auth_required, roles_required, roles_accepted
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
        else:
            subject = Subject.query.all()
            if not subject:
                return {'message': 'no subjects found'}, 404
        return marshal(subject, subject_fields)
    
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
        return marshal(subject, subject_fields) | {'chapters': marshal(subject.chapters, chapter_fields)} , 200