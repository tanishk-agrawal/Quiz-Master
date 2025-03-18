from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from flask_security.models import fsqla_v3

db = SQLAlchemy()
fsqla_v3.FsModels.set_db_info(db)

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), nullable=False, default=True)
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)

    roles = db.relationship('Role', secondary='roles_users', backref='users', cascade="all, delete")
    attempts = db.relationship('Attempt', backref='user', cascade="all, delete")

class Subject(db.Model):
    __tablename__ = 'subject'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.String())

    chapters = db.relationship('Chapter', backref='subject', cascade="all, delete")

class Chapter(db.Model):
    __tablename__ = 'chapter'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.String())

    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)
    quizzes = db.relationship('Quiz', backref='chapter', cascade="all, delete")

class Quiz(db.Model):
    __tablename__ = 'quiz'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    instructions = db.Column(db.String())
    time_limit = db.Column(db.Integer(), nullable=False) # in minutes
    show = db.Column(db.Boolean(), nullable=False, default=False)
    created_on = db.Column(db.DateTime(), nullable=False)
    deadline = db.Column(db.DateTime()) # optional
    
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'), nullable=False)
    questions = db.relationship('Question', backref='quiz', cascade="all, delete")
    attempts = db.relationship('Attempt', backref='quiz', cascade="all, delete")

class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key=True)
    statement = db.Column(db.String(), nullable=False)
    hint = db.Column(db.String())
    marks = db.Column(db.Float(), nullable=False, default=1.0)
    option_a = db.Column(db.String(), nullable=False)
    option_b = db.Column(db.String(), nullable=False)
    option_c = db.Column(db.String())
    option_d = db.Column(db.String())
    answer = db.Column(db.String(), nullable=False)
    remark = db.Column(db.String())

    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    scores = db.relationship('Score', backref='question', cascade="all, delete")

class Attempt(db.Model):
    __tablename__ = 'attempt'
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime())
    end_time = db.Column(db.DateTime())
    total_time = db.Column(db.Integer(), nullable=False)
    total_marks = db.Column(db.Float(), nullable=False)

    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    scores = db.relationship('Score', backref='attempt', cascade="all, delete")

class Score(db.Model):
    __tablename__ = 'score'
    id = db.Column(db.Integer, primary_key=True)
    selected_option = db.Column(db.String(), nullable=False)
    is_correct = db.Column(db.Boolean(), nullable=False)
    score = db.Column(db.Float(), nullable=False)

    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    attempt_id = db.Column(db.Integer, db.ForeignKey('attempt.id'), nullable=False)
