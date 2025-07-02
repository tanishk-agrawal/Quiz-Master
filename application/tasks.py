from celery import shared_task 
from .models import Attempt, User

import datetime
import csv

@shared_task(ignore_result=False, name='Download User History csv')
def generate_user_history_csv(user_id):
    attempts = Attempt.query.filter(Attempt.user_id == user_id).order_by(Attempt.submitted_at.desc()).all()
    list = []
    for attempt in attempts:
        correct, incorrect, unattempted = 0, 0, 0
        for score in attempt.scores:
            if score.is_correct:
                correct += 1
            elif score.selected_option_id is None:
                unattempted += 1
            else:
                incorrect += 1

        list.append({
            's.no.' : len(list) + 1,
            'quiz': attempt.quiz.name,
            'chapter': attempt.quiz.chapter.name,
            'subject': attempt.quiz.chapter.subject.name,
            'marks_scored': attempt.marks_scored,
            'max_marks': attempt.max_marks,
            'percentage': round((attempt.marks_scored / attempt.max_marks) * 100,1),
            'started_at': attempt.started_at,
            'submitted_at': attempt.submitted_at,
            'no_of_questions': len(attempt.quiz.questions),
            'correct': correct,
            'incorrect': incorrect,
            'unattempted': unattempted
        })
    
    csv_file_name = f"user_{user_id}_history_{datetime.datetime.now().strftime('%f')}.csv"
    fields = ['s.no.', 'quiz', 'subject', 'chapter', 'started_at', 'submitted_at', 'marks_scored', 'max_marks', 'percentage', 'no_of_questions', 'correct', 'incorrect', 'unattempted']

    with open(f'static/csv/{csv_file_name}', 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fields)
        writer.writeheader()
        writer.writerows(list)
    
    return csv_file_name

@shared_task(ignore_result=False, name='Download Users Performance CSV')
def generate_users_performance_csv():
    users = User.query.filter(User.roles.any(name='user')).all()
    
    performance = []
    for user in users:
        dict = {'user_id': user.id, 'email' : user.email, 'username' : user.username, 'scores': []}
        
        for attempt in user.attempts:
            dict['scores'].append((attempt.marks_scored/attempt.max_marks)*100)
            
        dict['no_of_quizzes'] = len(dict['scores'])
        dict['average_score(performance)'] = round(sum(dict['scores'])/dict['no_of_quizzes'], 1) if dict['no_of_quizzes'] > 0 else 0
        dict.pop('scores')            
        performance.append(dict)
    
    csv_file_name = f"user_performance_{datetime.datetime.now().strftime('%f')}.csv"
    fields = ['user_id', 'email', 'username', 'no_of_quizzes', 'average_score(performance)']

    with open(f'static/csv/{csv_file_name}', 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fields)
        writer.writeheader()
        writer.writerows(performance)
    
    return csv_file_name