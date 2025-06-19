import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";

import router from "./utils/router.js";


new Vue({
    el: "#app",
    template: `
    <div class="" >
        <Navbar v-if="currentRoute != '/'"></Navbar>
        <div class="container pt-1 vh-80" >
            <router-view></router-view>
        </div>
        <Footer v-if="requiresLogin"></Footer>
    </div>
    `,
    router,
    components: {
        Navbar,
        Footer
    },
    computed: {
        currentRoute() {
          return this.$route.path; // Access current route path
        }, 
        requiresLogin() {
            return this.$route.meta.requiresLogin
        }
    },
});
