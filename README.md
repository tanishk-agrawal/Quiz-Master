# 🧩 Quiz Master 

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![Flask](https://img.shields.io/badge/Backend-Flask-lightgrey?logo=flask)
![SQLite](https://img.shields.io/badge/SQLite3-Database-lightblue?logo=sqlite)
![Redis](https://img.shields.io/badge/Cache-Redis-D92B2B?logo=redis)
![Celery](https://img.shields.io/badge/Tasks-Celery-37814A?logo=celery)
![VueJS](https://img.shields.io/badge/Frontend-Vue.js-4FC08D?logo=vue.js)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.0-blueviolet?logo=bootstrap)
![ChartJS](https://img.shields.io/badge/Charts-Chart.js-FF6384?logo=chart.js)
![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red)

A **role-based multi-user quiz platform** where administrators manage subjects, chapters, quizzes, and questions, while users can register, attempt quizzes, and view their results with detailed performance analytics. 



## 📌 Features

- **Authentication & RBAC** – Secure login/signup with token & session-based authentication via Flask-Security.  
- **Admin Dashboard** – Create, edit, and delete subjects, chapters, quizzes, and questions.  
- **Quiz Scheduling** – Schedule quizzes with date, time, and duration.  
- **Search Functionality** – Search quizzes by name, subject, or chapter.  
- **Quiz Attempting & Timer** – Users can attempt quizzes with an auto-submission timer.  
- **Instant Results** – Detailed result breakdown with marks, percentage, and per-question feedback.  
- **User History** – Past attempts stored with performance trends & visualizations.  
- **Async CSV Export** – Export performance history asynchronously using Celery.  
- **Charts & Visualizations** – Trend analysis & summary statistics via ChartJS.  
- **Reminders & Reports** – Daily quiz reminders & monthly performance reports via email.  



## 🛠️ Technologies Used

- **Backend:** Flask, Flask-RESTful, Flask-Security, Flask-SQLAlchemy  
- **Database:** SQLite3  
- **Frontend:** VueJS, VueRouter, Bootstrap/CSS  
- **Asynchronous Tasks:** Celery, Redis  
- **Visualizations:** ChartJS  



## 🔗 API Endpoints

| Feature            | Endpoint(s) |
|---------------------|-------------|
| **Login**           | `/api/login` |
| **Signup**          | `/api/signup` |
| **Users**           | `/api/users` |
| **Profile**         | `/api/profile`, `/api/change-password` |
| **Subjects**        | `/api/subject`, `/api/subject/<int:subject_id>` |
| **Chapters**        | `/api/chapter`, `/api/chapter/<int:chapter_id>` |
| **Quizzes**         | `/api/quiz`, `/api/quiz/<int:quiz_id>`, `/api/quiz/<int:id>/toggle-show` |
| **Questions**       | `/api/question`, `/api/question/<int:id>` |
| **Attempts**        | `/api/quiz/<int:id>/user/attempt` |
| **Results**         | `/api/quiz/<int:id>/user/result` |
| **User History**    | `/api/user/history` |
| **Performance**     | `/api/user-performance`, `/api/user-performance/<user_id>` |


## 🚀 Live Demo & Walkthrough

🎥 [Project Walkthrough Video](https://drive.google.com/file/d/17LolM1Y_JA_X1D-XXQc0wMUdI69nRSRs/view?usp=sharing)

🖼️ [Project Screenshorts](https://drive.google.com/drive/folders/16Yi6XYsZCR-36R2yPZCqIvIXhzHL-0PG?usp=sharing)



## 👨‍💻 Author

**Tanishk Agrawal**  
📧 [tanishk.agrawal1911@gmail.com](mailto:tanishk.agrawal1911@gmail.com) 
