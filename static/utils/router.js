
import Home from "../pages/Home.js";
import Login from "../pages/Login.js";
import Signup from "../pages/Signup.js";
import UserDash from "../pages/UserDash.js";
import AdminDash from "../pages/AdminDash.js";
import AdminSubjectView from "../pages/AdminSubjectView.js";
import AdminChapterView from "../pages/AdminChapterView.js";
import AdminQuizView from "../pages/AdminQuizView.js";
import AdminUsersView from "../pages/AdminUsersView.js";

const routes = [
    { path: "/", component: Home, meta: { requiresLogin: false } },
    { path: "/login", component: Login, meta: { requiresLogin: false } },
    { path: "/signup", component: Signup, meta: { requiresLogin: false } },

    // user routes
    { path: "/dashboard", component: UserDash, meta: { requiresLogin: true, role: "user" } },

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
        if(localStorage.getItem('role') == 'admin') {
          next('/admin/dashboard');
        } else {
          next('/dashboard');
        }
      } else {
        next();
      }
    }
});

export default router;