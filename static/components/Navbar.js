export default {
    template: `
    <div class="row bg-body-tertiary py-1 px-5 shadow fw-medium" >
        <div class="col-auto fs-4 ">
            <router-link to="/" class="text-decoration-none text-dark">Quiz Master</router-link>
        </div>
        <div class="col"></div>
        <div class="col-auto my-auto text-end" v-if="currentRoute.meta.requiresLogin">
            <div v-if="currentRoute.meta.role == 'user'">
                <router-link to="/dashboard" class="text-decoration-none text-dark mx-3"><i class="bi bi-house-fill"></i> Home</router-link>
                <router-link to="/history" class="text-decoration-none text-dark mx-3"><i class="bi bi-hourglass-split"></i> History</router-link>
            </div>
            <div v-else>
                <router-link to="/admin/dashboard" class="text-decoration-none text-dark mx-3"><i class="bi bi-house-fill"></i> Home</router-link>
                <router-link to="/admin/users" class="text-decoration-none text-dark mx-3"><i class="bi bi-people-fill"></i> Users</router-link>
                <router-link to="" class="text-decoration-none text-dark mx-3"><i class="bi bi-bar-chart-line-fill"></i> Stats</router-link>                
            </div>
        </div>
        <div class="col-auto my-auto text-end p-0" v-if="currentRoute.meta.requiresLogin">
            <button class="btn btn-outline-danger btn-sm rounded-pill w-100 fw-medium" @click="logout">
                <i class="bi bi-box-arrow-right"></i>
                <span class="">Logout</span>
            </button>
        </div>
    </div>`,
    methods: {
      logout() {
        localStorage.clear();
        this.$router.push("/");
      }
    },
    computed: {
        currentRoute() {
          return this.$route; // Access current route path
        }
    },
}