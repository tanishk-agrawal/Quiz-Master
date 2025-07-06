from celery import shared_task 
from flask import render_template
from .models import Attempt, User, Quiz
from .mail import send_email

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

@shared_task(ignore_results = False, name = "Send Daily Reminder")
def daily_reminder():
    users = User.query.filter(User.roles.any(name='user')).all()
    quizzes = Quiz.query.filter(Quiz.show == True).all()

    for user in users:
        
        quiz_list = []
        if user.last_login:
            for quiz in quizzes:
                if quiz.created_on > user.last_login:
                    quiz_list.append(quiz)

        else:
            quiz_list = quizzes
        
        if len(quiz_list) > 0:
            msg = f'''Hi {user.username},<br><br>
                    We’ve added <b>{len(quiz_list)}</b> new quizzes since your last visit. 
                    Come check them out and test your knowledge!<br>
                    Happy quizzing!<br><br>
                    Best regards,<br>
                    <b>Team Quiz Master</b>'''
            send_email(user.email, subject = "🔔 Daily Reminder - Quiz Master", message = msg)
            print(f"mail sent to {user.email}")

    return 'Daily Reminder Sent Successfully'

@shared_task(ignore_results = False, name = "Send Monthly Report")
def monthly_report():
    users = User.query.filter(User.roles.any(name='user')).all()
    months_list = ['January','February','March','April','May','June','July','August','September','October','November','December']
    month = datetime.datetime.now().month -1 if datetime.datetime.now().month > 1 else 12
    for user in users:
        list, subjects, chartData = [], [], []
        for attempt in user.attempts:
            if attempt.submitted_at.month != month:
                continue
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

            time_taken = (attempt.submitted_at - attempt.started_at).total_seconds() / 60  
            percent = (attempt.marks_scored / attempt.max_marks) * 100
            ques_attempted = len([score for score in attempt.scores if score.selected_option_id is not None]) 
            chartData.append({
                'x': round(time_taken, 2),
                'y': round(percent, 2),
                'r': min(15, max(5, ques_attempted)),
                'quiz' : attempt.quiz.name,
                'no_of_ques' : ques_attempted
            })

            f1 = False
            for subject in subjects:
                if subject['name'] == attempt.quiz.chapter.subject.name:
                    f1 = True
                    subject['scores'].append((attempt.marks_scored/attempt.max_marks)*100)
                    break
            if not f1:
                subjects.append({'name': attempt.quiz.chapter.subject.name, 'scores': [(attempt.marks_scored/attempt.max_marks)*100]})
        for subject in subjects:
            subject['no_of_quizzes'] = len(subject['scores'])
            subject['average'] = round(sum(subject['scores'])/subject['no_of_quizzes'], 1) if subject['no_of_quizzes'] > 0 else 0

        usr = {'username': user.username, 'email': user.email}
        msg = render_template('monthly_report.html', user = usr, attempts = list, no_of_quizzes = len(list), 
                              month = months_list[month-1], subjects = subjects, chartData = chartData)
        send_email(user.email, subject = "📊 Monthly Report - Quiz Master", message = msg)
        print(f"mail sent to {user.email}")

    return 'Monthly Report Sent Successfully'