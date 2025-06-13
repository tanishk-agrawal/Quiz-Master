export default {
    template: `
    <div class="row">
        <div class="col d-flex justify-content-center align-items-center" style="height: 90vh">
            <div class="card shadow-lg p-4 rounded-5" style="width: 450px;">
            <div class="fst-italic text-center mb-2">
                <h2 class="m-0">Signup</h2>
                <p>Create your account</p>
                <div v-if="error" id="error" class="alert alert-danger alert-dismissible fade show text-capitalize text-start py-1 px-2 mt-0" role="alert" >
                    {{ error }} <button type="button" class="btn-close p-2"  @click="error = ''"></button>
                </div>
            </div>
                <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="username" v-model="formData.username" placeholder="Username" required>
                    <label for="username"><i class="bi bi-person-fill"></i> Username</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="Email" required>
                    <label for="email"><i class="bi bi-envelope-at-fill"></i> Email</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="password" class="form-control" id="password" v-model="formData.password" placeholder="Password" required>
                    <label for="password"><i class="bi bi-lock-fill"></i> Password</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="password" class="form-control" id="cpassword" v-model="formData.cpassword" placeholder="Confirm Password" required>
                    <label for="cpassword"><i class="bi bi-lock"></i> Confirm Password</label>
                </div>

                <button type="submit" @click="submitInfo" class="fw-bold btn btn-warning w-100">Signup</button>
                <p class="text-center mt-3">Already have an account? <router-link to="/login">Login</router-link></p>
            </div>
        </div>
    </div>`,
    data: function() {
        return {
            formData:{
                username: "",
                email: "",
                password: "",
                cpassword: ""
            },
            error: ""
        }
    },
    methods: {
        async submitInfo() {
            if(!this.isValidInput()) {
                console.error(this.error);
                return;
            }
        
            const origin = window.location.origin;
            const url = `${origin}/api/signup`;
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
                this.$router.push("/login");

            } else {
                const errorData = await res.json();
                this.error = errorData.message;
                console.error("Signup failed:", errorData);
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
            if (this.formData.password != this.formData.cpassword){
                this.error = "Passwords don't match.";
                return;
            } 
            return 1
        },
        isValidEmail(email) {
            const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return re.test(email);
        },
    }
}