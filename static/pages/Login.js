export default {
    template: `
    <div>
    <div class="row">
        <div class="col d-flex justify-content-center align-items-center" style="height: 90vh">
            <div class="card shadow-lg p-4 rounded-5" style="width: 450px;">
            <div class="fst-italic text-center mb-2">
                <h2 class="m-0">Welcome Back</h2>
                <p>Enter your credentials to login</p>            
                <div v-if="error" id="error" class="alert alert-danger alert-dismissible fade show text-capitalize text-start py-1 px-2 mt-0" role="alert" >
                    <small class="bi bi-exclamation-diamond-fill font-monospace"> {{ error }} </small><button type="button" class="btn-close p-2"  @click="error = ''"></button>
                </div>
            </div>
                <div class="form-floating mb-2">
                    <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="Email" required>
                    <label for="email"><i class="bi bi-envelope-at-fill"></i> Email</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="password" class="form-control" id="password" v-model="formData.password" placeholder="Password" required>
                    <label for="password"><i class="bi bi-key-fill"></i> Password</label>
                </div>
                <button type="submit" @click="submitInfo" class="fw-bold btn btn-warning w-100">Login</button>
                <p class="text-center mt-3">Don't have an account? <router-link to="/signup">Signup</router-link></p>
            </div>
        </div>
    </div>
    </div>`,
    data: function() {
        return {
            formData:{
                email: "",
                password: ""
            },
            error: "",
        }
    },
    methods: {
        async submitInfo() {
            if(!this.isValidInput()) {
                console.log(this.error);
                return;
            }
            
            const origin = window.location.origin;
            const url = `${origin}/api/login`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.formData),
                credentials: "same-origin", // Include credentials (cookies) with the request
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("email", data.email);
                localStorage.setItem("username", data.username);
                localStorage.setItem("role", data.role);

                this.$router.push("/");
            } else {
                const errorData = await res.json();
                this.error = errorData.message;
                console.error("Login failed:", errorData);
            }
        },

        isValidInput() {
            if (!this.formData.email || !this.isValidEmail(this.formData.email)) {
                this.error = "Please enter a valid email address.";
                return;
            }
            if (!this.formData.password || this.formData.password.length < 4) {
                this.error = "Password must be at least 4 characters long.";
                return;
            }
            return 1;  
        },
        isValidEmail(email) {
            const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return re.test(email);
        },
    },
    mounted() {
        if (this.$route.params.error) {
            this.error = this.$route.params.error;
        }
    }
}