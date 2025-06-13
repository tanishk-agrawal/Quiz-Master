export default {
    template: `
    <div>
    <div class="row mt-4 mb-2">
        <div class="col">
            <h4 class="fw-bold">Users</h4>
        </div>
    </div>
    <div class="card shadow-sm rounded-3">
    <table class="table table-striped table-hover my-1">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
            </tr>
        </thead>
        <tbody>
            <div v-if="users.length == 0" class="text-center alert alert-warning fw-bold m-4">No Users Found</div>
            <tr  v-for="user in users">
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
            users: []
        }
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