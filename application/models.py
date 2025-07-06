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
    last_login = db.Column(db.DateTime(), nullable=True)
    active = db.Column(db.Boolean(), nullable=False, default=True)
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)

    roles = db.relationship('Role', secondary='roles_users', backref='users', cascade="all, delete")
    attempts = db.relationship('Attempt', backref='user', cascade="all, delete-orphan")

class Subject(db.Model):
    __tablename__ = 'subject'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.String())

    chapters = db.relationship('Chapter', backref='subject', cascade="all, delete-orphan")

class Chapter(db.Model):
    __tablename__ = 'chapter'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.String())

    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)
    quizzes = db.relationship('Quiz', backref='chapter', cascade="all, delete-orphan")

class Quiz(db.Model):
    __tablename__ = 'quiz'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    instructions = db.Column(db.String())
    time_limit = db.Column(db.Integer(), nullable=False) # in minutes
    created_on = db.Column(db.DateTime(), nullable=False)
    scheduled_on = db.Column(db.DateTime())
    show = db.Column(db.Boolean(), default=False)
    
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'), nullable=False)
    questions = db.relationship('Question', backref='quiz', cascade="all, delete-orphan")
    attempts = db.relationship('Attempt', backref='quiz', cascade="all, delete-orphan")

class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key=True)
    statement = db.Column(db.String(), nullable=False)
    hint = db.Column(db.String())
    marks = db.Column(db.Float(), nullable=False, default=1.0)
    remark = db.Column(db.String())

    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    options = db.relationship('Option', backref='question', cascade="all, delete-orphan")    
    scores = db.relationship('Score', backref='question', cascade="all, delete-orphan")

class Option(db.Model):
    __tablename__ = 'option'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    is_correct = db.Column(db.Boolean(), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)

class Attempt(db.Model):
    __tablename__ = 'attempt'
    id = db.Column(db.Integer, primary_key=True)
    max_marks = db.Column(db.Float(), nullable=False, default=0.0)
    marks_scored = db.Column(db.Float(), nullable=False, default=0.0)
    started_at = db.Column(db.DateTime(), nullable=False)
    submitted_at = db.Column(db.DateTime())

    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    scores = db.relationship('Score', backref='attempt', cascade="all, delete-orphan")    

class Score(db.Model):
    __tablename__ = 'score'
    id = db.Column(db.Integer, primary_key=True)    
    is_correct = db.Column(db.Boolean(), nullable=False)
    marks = db.Column(db.Float(), nullable=False)
    
    selected_option_id = db.Column(db.Integer, db.ForeignKey('option.id'), nullable=True)
    selected_option = db.relationship('Option', foreign_keys=[selected_option_id])

    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    attempt_id = db.Column(db.Integer, db.ForeignKey('attempt.id'), nullable=False)
