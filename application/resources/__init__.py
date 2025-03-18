from flask_restful import Api
from .subject import *
from .chapter import *
from .quiz import *

api = Api(prefix='/api')

api.add_resource(SubjectAPI, '/subject', '/subject/<int:subject_id>')
api.add_resource(SubjectChaptersAPI, '/subject/<int:subject_id>/chapters')
api.add_resource(ChapterAPI, '/chapter', '/chapter/<int:chapter_id>')
api.add_resource(ChapterQuizzesAPI, '/chapter/<int:chapter_id>/quizzes')
api.add_resource(QuizAPI, '/quiz', '/quiz/<int:quiz_id>')
api.add_resource(QuizQuestionsAPI, '/quiz/<int:quiz_id>/questions')