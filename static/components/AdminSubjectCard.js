export default {
    template: `
    <div>
    <div class="card shadow-sm m-2" style="width: 16rem;">
        <div class="card-body">
        <router-link :to="'/admin/subject/' + id" class="link-dark link-underline-opacity-0">
            <h5 class="card-title">{{name}}</h5>
        </router-link>      
        </div>
        <div class="card-footer fw-bold d-flex justify-content-between">
            <router-link :to="'/admin/subject/' + id" class="link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover"><i class="bi bi-box-arrow-up-right"></i> View </router-link>
            <a href="#" class="link-primary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover" data-bs-toggle="modal" :data-bs-target="'#editSubjectModal' + id"><i class="bi bi-pencil-square"></i> Edit</a>
            <a href="#" class="link-danger link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover " data-bs-toggle="modal" :data-bs-target="'#deleteModal' + id"><i class="bi bi-trash"></i> Delete</a>
        </div>
    </div>
    
        <div class="modal fade" :id="'deleteModal' + id" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="deleteModalLabel"><i class="bi bi-exclamation-triangle-fill"></i> &nbsp; Are you sure?</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <ul class="m-0 text-danger-emphasis">
                    <li><b>{{name}}</b> - This subject will be permanently deleted.</li>
                    <li>All chapters associated with this subject will be deleted.</li>
                    <li>All quizzes within this subject will be deleted.</li>
                    <li>This action cannot be undone.</li>
                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" @click="deleteSubject()" data-bs-dismiss="modal">Delete</button>
            </div>
            </div>
        </div>
        </div>

        <div class="modal fade" :id="'editSubjectModal' + id" tabindex="-1" aria-labelledby="editSubjectModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editSubjectModalLabel">Edit Subject - {{id}}</h1>
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
                <span v-if="editSubjecterror" class="text-danger text-capitalize">Error: {{ editSubjecterror }}</span>
                <span v-else></span>
                <button type="button" class="btn btn-success" @click="editSubject()">Submit</button>
            </div>
            </div>
        </div>
        </div>
    </div>
    `,
    props: {
        name:{
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            formData: {
                name: this.name,
                description: this.description
            },
            editSubjecterror: ""
        }
    },

    methods: {
        async deleteSubject(){
            const origin = window.location.origin;
            const url = `${origin}/api/subject/${this.id}`;
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                credentials: "same-origin", 
            });

            if (res.ok) {
                this.$emit("change");
                // reload or re-render the list of subjects after successful deletion
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        async editSubject() {
            const origin = window.location.origin;
            const url = `${origin}/api/subject/${this.id}`;
            const res = await fetch(url, {
                method: "PUT",
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
                const modalElement = document.getElementById("editSubjectModal"+this.id);
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                this.$emit("change");
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                }                
                const errorData = await res.json();
                console.error(errorData);
                this.editSubjecterror = errorData.message;
            }
        },

        resetModal() {
            this.formData.name = this.name;
            this.formData.description = this.description;
            this.editSubjecterror = "";
        }
    },
    mounted() {
        // Reset form and error when modal is closed
        const modalElement = document.getElementById("editSubjectModal"+this.id);
        modalElement.addEventListener("hidden.bs.modal", () => {
            this.resetModal();
        });
    }
}