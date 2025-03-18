import SubjectCard from "../components/AdminSubjectCard.js"

export default {
    template: `
    <div>
        <div class="row my-3">
            <div class="col">
                <h4 class="fst-italic">Welcome, Admin</h4>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col">
            <h4 class="fw-bold">Subjects ({{subjects.length}})</h4>
            </div>
            <div class="col my-auto text-end fw-bold">
            <a href="#" class="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" data-bs-toggle="modal" data-bs-target="#addSubjectModal"><i class="bi bi-plus-circle"></i> Add  Subject</a>
            </div>
        </div>
        <div v-if="subjects.length == 0" class="text-center alert alert-warning fw-bold m-4">No Subjects Found</div>
        <div v-else class="d-flex flex-wrap">
            <div v-for="subject in subjects">
                <SubjectCard :name="subject.name" :description="subject.description" :id="subject.id" @change="fetchSubjects"></SubjectCard>
            </div>
        </div>

        <div class="modal fade" id="addSubjectModal" tabindex="-1" aria-labelledby="addSubjectModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="addSubjectModalLabel">Add Subject</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="name" v-model="formData.name" placeholder="Subject Name" required>
                    <label for="name">Subject Name</label>
                </div>
                <div class="form-floating">
                    <textarea class="form-control" id="description" v-model="formData.description" placeholder="Description" style="height: 150px"></textarea>
                    <label for="description">Description</label>
                </div>
            </div>
            <div class="modal-footer justify-content-between">
                <span v-if="addSubjecterror" class="text-danger text-capitalize">Error: {{ addSubjecterror }}</span>
                <span v-else></span>
                <button type="button" class="btn btn-success" @click="createSubject()">Submit</button>
            </div>
            </div>
        </div>
        </div>
    </div>

    `,
    data() {
        return {
            subjects : [],
            formData: {
                name: "",
                description: ""
            },
            addSubjecterror : ""
        }
    },
    components: {
        SubjectCard
    },
    methods: {
        async fetchSubjects() {
            const origin = window.location.origin;
            const url = `${origin}/api/subject`;
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
                this.subjects = data;
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
                } else if (res.status === 404) {
                    this.subjects = [];
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },
        async createSubject() {
            const origin = window.location.origin;
            const url = `${origin}/api/subject`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                body: JSON.stringify(this.formData),
                credentials: "same-origin",
            });

            if (res.ok) {
                this.resetModal();
                
                // Automatically close the modal after successful creation
                const modalElement = document.getElementById("addSubjectModal");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                this.fetchSubjects();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
                }                
                const errorData = await res.json();
                console.error(errorData);
                this.addSubjecterror = errorData.message;
            }
        },
        resetModal() {
            this.formData.name = "";
            this.formData.description = "";
            this.addSubjecterror = "";
        }
    },
    mounted() {
        this.fetchSubjects();

        // Reset form and error when modal is closed
        const modalElement = document.getElementById("addSubjectModal");
        modalElement.addEventListener("hidden.bs.modal", () => {
            this.resetModal();
        });
    }
}