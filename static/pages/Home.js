export default {
    template: `
    <div class="row" >
        <div class="col text-center position-absolute top-50 start-50 translate-middle" >
            <h1 class="fw-bolder">Welcome to Quiz Master</h1>
            <p class="fst-italic fs-5 text-warning-emphasis">The ultimate platform to prepare for exams with interactive quizzes.</p>
            <router-link to="/login" class="fw-bold btn btn-warning btn-lg me-2">Login</router-link>
            <router-link to="/signup" class="fw-bold btn btn-outline-dark btn-lg">Sign Up</router-link>
        </div>
    </div>`
}