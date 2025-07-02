export default {
    template: `
    <div class="">
    <div class="card shadow-sm" style="height: 60px; z-index:1">
      <div class="card-body d-flex justify-content-between fw-bold">
        <span class="h5 m-0 fw-bold">Welcome, {{ username }}</span>
        <small class=""><i class="bi bi-envelope-at-fill"></i> {{ email }}</small>
        <a href="#"  class="dropdown" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-sliders"></i></a>
            <ul class="dropdown-menu" style="font-size: 0.8rem;">
                <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateProfile" @click="fillEditFormData">Edit Profile</a></li>
                <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#changePassword" @click="resetFormData">Change Password</a></li>
            </ul>
      </div>
    </div>


        <div class="modal fade" id="updateProfile" tabindex="-1" aria-labelledby="updateProfileLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="updateProfileLabel">Edit Profile</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="username" v-model="editFormData.username" placeholder="Username" required>
                    <label for="username"><i class="bi bi-person-fill"></i> Username</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="email" class="form-control" id="email" v-model="editFormData.email" placeholder="Email" required>
                    <label for="email"><i class="bi bi-envelope-fill"></i> Email</label>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="password" v-model="editFormData.password" placeholder="Password" required>
                    <label for="password"><i class="bi bi-key-fill"></i> Password</label>
                </div>
            </div>
            <div class="modal-footer justify-content-between">
                <span v-if="editProfileerror" class="text-danger text-capitalize">Error: {{ editProfileerror }}</span>
                <span v-else></span>
                <button type="button" class="btn btn-success" @click="editProfile()">Submit</button>
            </div>
            </div>
        </div>
        </div>


        <div class="modal fade" id="changePassword" tabindex="-1" aria-labelledby="changePasswordLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="changePasswordLabel">Change Password</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-floating mb-2">
                    <input type="password" class="form-control" id="password" v-model="changePasswordFormData.password" placeholder="Current Password" required>
                    <label for="password">Current Password</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="password" class="form-control" id="npassword" v-model="changePasswordFormData.new_password" placeholder="New Password" required>
                    <label for="npassword">New Password</label>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="cpassword" v-model="changePasswordFormData.cpassword" placeholder="Confirm Password" required>
                    <label for="cpassword">Confirm Password</label>
                </div>
            </div>
            <div class="modal-footer justify-content-between">
                <span v-if="changePassworderror" class="text-danger text-capitalize">Error: {{ changePassworderror }}</span>
                <span v-else></span>
                <button type="button" class="btn btn-success" @click="changeUserPassword()">Submit</button>
            </div>
            </div>
        </div>
        </div>

  </div>
    
    `,
    data() {
        return {
            username: "",
            email: "",
            role: "",

            editFormData: {
                username: "",
                email: "",
                password: ""
            },
            editProfileerror: "",

            changePasswordFormData: {
                password: "",
                new_password: "",
                cpassword: ""
            },
            changePassworderror: "",
        }
    },
    methods: {
        async getUserInfo() {
            const origin = window.location.origin;
            const url = `${origin}/api/profile`;
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
                this.username = data.username;
                this.email = data.email;
                this.role = data.role;
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push("/");
                } 
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        fillEditFormData() {
            this.editFormData.username = this.username;
            this.editFormData.email = this.email;
            this.editFormData.password = '';
            this.editProfileerror = '';
        },

        async editProfile() {
            const origin = window.location.origin;
            const url = `${origin}/api/profile`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                credentials: "same-origin",
                body: JSON.stringify(this.editFormData)
            });

            if (res.ok) {
                this.getUserInfo();

                // Automatically close the modal after successful creation
                const modalElement = document.getElementById("updateProfile");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push("/");
                } 
                const errorData = await res.json();
                this.editProfileerror = errorData.message;
                console.error(errorData);
            }
        },

        resetFormData() {
            this.changePasswordFormData.password = '';
            this.changePasswordFormData.new_password = '';
            this.changePasswordFormData.cpassword = '';
            this.changePassworderror = '';
        },

        async changeUserPassword() {
            if (this.changePasswordFormData.new_password !== this.changePasswordFormData.cpassword) {
                this.changePassworderror = "Confirm Password do not match";
                return;
            }
            const origin = window.location.origin;
            const url = `${origin}/api/change-password`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                credentials: "same-origin",
                body: JSON.stringify(this.changePasswordFormData)
            });

            if (res.ok) {
                this.getUserInfo();

                // Automatically close the modal after successful creation
                const modalElement = document.getElementById("changePassword");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push("/");
                } 
                const errorData = await res.json();
                this.changePassworderror = errorData.message;
                console.error(errorData);
            }
        }
    },
    mounted() {
        this.getUserInfo();
    }
};