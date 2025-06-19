export default {
    template: `
    <div>
    <div class="row mt-4 mb-2">
        <div class="col">
            <h4 class="fw-bold">Users</h4>
        </div>
        <div class="col my-auto d-flex justify-content-end">
            <input type="text" id="search" placeholder=" 🔍︎ Search" v-model="searchString" class="border-2 form-control form-control-sm" style="max-width:350px">
        </div>
    </div>
    <div class="card shadow-sm rounded-3 p-3">
    <table class="table table-hover my-1">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
            </tr>
        </thead>        
        <caption v-if="filteredUsers.length == 0"><div class="text-center alert alert-warning fw-bold m-4">No Users Found</div></caption>
        <tbody>
            <tr  v-for="user in filteredUsers">
                <th scope="row">{{user.id}}</th>
                <td>{{user.username}}</td>
                <td>{{user.email}}</td>
                <td>{{user.role}}</td>
            </tr>
        </tbody>
    </table>
    </div>

    </div>
    `,
    data() {
        return {
            users: [],

            searchString:""
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
            const url = `${origin}/api/users`;
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
        }
    },
    mounted() {
        this.fetchUsers();
    }
}