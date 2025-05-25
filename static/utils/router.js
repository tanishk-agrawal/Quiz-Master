
import Home from "../pages/Home.js";
import Login from "../pages/Login.js";
import Signup from "../pages/Signup.js";
import NotFound404 from "../pages/NotFound404.js";

import UserDash from "../pages/UserDash.js";
import UserAllQuiz from "../pages/UserAllQuiz.js";
import UserQuizView from "../pages/UserQuizView.js";
import UserQuizAttempt from "../pages/UserQuizAttempt.js";
import UserQuizResult from "../pages/UserQuizResult.js";
import UserSubjectView from "../pages/UserSubjectView.js";
import UserAttemptHistory from "../pages/UserAttemptHistory.js";

import AdminDash from "../pages/AdminDash.js";
import AdminSubjectView from "../pages/AdminSubjectView.js";
import AdminChapterView from "../pages/AdminChapterView.js";
import AdminQuizView from "../pages/AdminQuizView.js";
import AdminUsersView from "../pages/AdminUsersView.js";

const routes = [
    { path: "/", component: Home, meta: { requiresLogin: false } },
    { path: "/login", component: Login, meta: { requiresLogin: false } },
    { path: "/signup", component: Signup, meta: { requiresLogin: false } },
    { path: "/404", component: NotFound404, meta: { requiresLogin: false, error: true } },

    // user routes
    { path: "/dashboard", component: UserDash, meta: { requiresLogin: true, role: "user" } },
    { path: "/quiz/all", component: UserAllQuiz, meta: { requiresLogin: true, role: "user" } },
    { path: "/quiz/:id", component: UserQuizView, meta: { requiresLogin: true, role: "user" } },
    { path: "/quiz/:id/attempt", component: UserQuizAttempt, meta: { requiresLogin: true, role: "user" } },
    { path: "/quiz/:id/result", component: UserQuizResult, meta: { requiresLogin: true, role: "user" } },
    { path: "/subject/:id", component: UserSubjectView, meta: { requiresLogin: true, role: "user" } },
    { path: "/history", component: UserAttemptHistory, meta: { requiresLogin: true, role: "user" } },

    // admin routes
    { path: "/admin/dashboard", component: AdminDash, meta: { requiresLogin: true, role: "admin" } },
    { path: "/admin/subject/:id", component: AdminSubjectView, meta: { requiresLogin: true, role: "admin" } },
    { path: "/admin/chapter/:id", component: AdminChapterView, meta: { requiresLogin: true, role: "admin" } },
    { path: "/admin/quiz/:id", component: AdminQuizView, meta: { requiresLogin: true, role: "admin" } },
    { path: "/admin/users", component: AdminUsersView, meta: { requiresLogin: true, role: "admin" } },
];

const router = new VueRouter({
    routes
});

//navigation guard
router.beforeEach((to, from, next) => {
    if (to.meta.requiresLogin) {
      if(!localStorage.getItem('token')) {
        next('/'); 
      } else {
        if(to.meta.role != localStorage.getItem('role')) {
          if(localStorage.getItem('role') == 'admin') {
            next('/admin/dashboard');
          } else {
            next('/dashboard');
          }
        } else{
          next();
        }
      }
    } else {
      if(localStorage.getItem('token')){
        if(to.meta.error) {
          next();
        }
        else if(localStorage.getItem('role') == 'admin') {
          next('/admin/dashboard');
        } else {
          next('/dashboard');
        }
      } else {
        next();
      }
    }

    if(localStorage.getItem('attempting')){ 
        if(to.path != '/quiz/' + localStorage.getItem('attempting') + '/attempt') {
            next('/quiz/' + localStorage.getItem('attempting') + '/attempt');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;