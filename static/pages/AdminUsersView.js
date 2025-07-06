export default {
    template: `
    <div>
    <div class="toast align-items-center position-absolute border border-dark" style="top: 50px; right:10px; z-index: 5" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex fw-bold">
            <div class="toast-body text-info-emphasis" v-if="toast==1">
                <div class="spinner-border spinner-border-sm me-2" role="status"><span> </span>
            </div>Export Initiated...</div>
            <div class="toast-body text-success" v-else-if="toast==2"><i class="bi bi-check-circle-fill me-2"></i> Export Successful...</div>
            <div class="toast-body text-danger" v-else-if="toast==3"><i class="bi bi-exclamation-circle-fill me-2"></i> Something went wrong. Try again later...</div>
        </div>
    </div> 
    <div class="row mt-4 mb-2">
        <div class="col">
            <h3 class="fw-bold">Users</h3>
        </div>
        <div class="col my-auto d-flex justify-content-end">
            <input type="text" id="search" placeholder=" 🔍︎ Search" v-model="searchString" class="border-2 form-control form-control-sm" style="max-width:350px">
        </div>
        <div class="col my-auto text-end fw-bold">
            <a href="#" @click="exportCSV" class="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"><i class="bi bi-download"></i> Export CSV</a>
        </div>
    </div>
    <div class="card shadow-sm rounded-3 p-2">
    <table class="table table-hover my-1 text-center">
        <thead>
            <tr>
                <th scope="col">S. No.</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col"># Quizzes Attempted</th>
                <th scope="col">Performance</th>
            </tr>
        </thead>        
        <caption v-if="filteredUsers.length == 0"><div class="text-center alert alert-warning fw-bold m-4">No Users Found</div></caption>
        <tbody>
            <tr  v-for="user, index in filteredUsers">
                <th scope="row">{{index + 1}}</th>
                <td>{{user.username}}</td>
                <td>{{user.email}}</td>
                <td>{{user.no_of_quizzes}}</td>
                <td ><div class="progress my-1 position-relative fw-bold" role="progressbar">
                        <div class="progress-bar fw-bold" :style="progressStyle(user.average)"></div>
                        <div class="position-absolute top-50 start-50 translate-middle" :class="user.average < 80 ? 'text-black' : 'text-white'">{{user.average}}%</div>
                </div></td>
            </tr>
        </tbody>
    </table>
    </div>
    </div>
    `,
    data() {
        return {
            users: [],

            searchString:"",
            toast : 0,
        }
    },

    computed: {
        filteredUsers() {
            if(!this.searchString) {
                return this.users;
            }
            const q = this.searchString.trim().toLowerCase();

            return this.users.filter(item => {
                return (
                    item.username?.toLowerCase().includes(q) ||
                    item.email?.toLowerCase().includes(q)
                );
            });
        },
    },
    methods: {
        async fetchUsers() {
            const origin = window.location.origin;
            const url = `${origin}/api/user-performance`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                credentials: "same-origin",
            });

            if (res.ok) {
                const data = await res.json();
                this.users = data;
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } 
                const errorData = await res.json();
                console.error(errorData);
            }
        },
        async exportCSV(){
            this.showToast(1);

            const origin = window.location.origin;
            const url = `${origin}/api/export-csv/all`; 
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem("token")
                },
                credentials: "same-origin"
            })
            if (res.ok) {
                const data = await res.json();                
                setTimeout(() => this.getCSV(data.id), 1000);
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } 
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        showToast(n){
            this.toast = n;
            const toast = document.querySelector('.toast');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
            toastBootstrap.show();
        },

        getCSV(id){
            fetch('/api/is-ready/' + id ).then(res => res.json())
            .then(data => {
                console.log(data);
                if(data.ready){
                    this.showToast(2);
                    window.location.href = '/api/get-csv/' + id;
                } else {
                    this.showToast(3);
                }
            });
        },
        
        progressStyle(percent) {
            let color = "#198754";
            if (percent < 30){color = "#dc3545";}
            else if (percent < 60){color = "#ffc107";}
            else if (percent < 80){color = "#bbdc35";}

            return {
                backgroundColor: color,
                width: percent + '%'
            };
        }
    },
    mounted() {
        this.fetchUsers();
    }
}