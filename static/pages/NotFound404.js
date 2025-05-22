export default {
    template: `
    <div class="row" >
        <div class="col text-center position-absolute top-50 start-50 translate-middle" >
            <div class="text-warning display-1 fw-bold bi bi-exclamation-triangle-fill"></div>
            <h1 class="fw-bolder">404 - Page Not Found</h1>
            <p class="fst-italic fs-5 text-warning-emphasis">Oops! The page you're looking for doesn't exist or has been moved.</p>
            <router-link to="/" class="fw-bold btn btn-outline-warning border border-dark text-dark btn-lg me-2">Back to Home</router-link>
        </div>
    </div>`
}