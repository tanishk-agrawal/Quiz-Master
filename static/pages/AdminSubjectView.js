import ChapterCard from '../components/AdminChapterCard.js'

export default {
    template: `
    <div>
    <div class="card  my-4 p-4">
    <div class="row">
        <div class="col">
            <h3 class="fw-bold ">{{subjectName}}</h3>
            <p class="">{{subjectDescription}}</p>
            
        </div>
        <div class="vr p-0 mx-2"></div>
        <div class="col-auto d-flex flex-column justify-content-center">
            <button class="btn btn-primary btn-sm my-1" data-bs-toggle="modal" data-bs-target="#editSubjectModal" @click="fillSubjectForm"><i class="bi bi-pencil-square"></i> &nbsp; Edit</button>
            <button class="btn btn-danger btn-sm my-1" data-bs-toggle="modal" data-bs-target="#deleteSubjectModal"><i class="bi bi-trash-fill"></i> &nbsp; Delete</button>
        </div>
    </div>
    </div>

    <div class="row">
        <div class="col">
        <h4 class="fw-bold">Chapters ({{chapters.length}})</h4>
        </div>
        <div class="col my-auto text-end fw-bold">
        <a href="#" class="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" data-bs-toggle="modal" data-bs-target="#addChapterModal"><i class="bi bi-plus-circle"></i> Add  Chapter</a>
        </div>
    </div>
    <div v-if="chapters.length == 0" class="text-center alert alert-warning fw-bold m-4">No Chapters Found</div>
    <div v-else class="d-flex flex-wrap">
        <div v-for="chapter in chapters">
            <ChapterCard :name="chapter.name" :description="chapter.description" :id="chapter.id" :subjectId="subjectId" :subjectName="subjectName" @change="fetchSubjectChapters"></ChapterCard>
        </div>
    </div>

        <div class="modal fade" id="addChapterModal" tabindex="-1" aria-labelledby="addChapterModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="addChapterModalLabel">Add Chapter</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="name" v-model="formData.name" placeholder="Chapter Name" required>
                    <label for="name">Chapter Name</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="subname" v-model="subjectName" disabled readonly>
                    <label for="subname">Subject</label>
                </div>
                <div class="form-floating">
                    <textarea class="form-control" id="description" v-model="formData.description" placeholder="Description" style="height: 150px"></textarea>
                    <label for="description">Description</label>
                </div>
            </div>
            <div class="modal-footer justify-content-between">
                <span v-if="addChaptererror" class="text-danger text-capitalize">Error: {{ addChaptererror }}</span>
                <span v-else></span>
                <button type="button" class="btn btn-success" @click="createChapter()">Submit</button>
            </div>
            </div>
        </div>
        </div>
    
        <div class="modal fade" id="deleteSubjectModal" tabindex="-1" aria-labelledby="deleteSubjectModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="deleteSubjectModalLabel"><i class="bi bi-exclamation-triangle-fill"></i> &nbsp; Are you sure?</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <ul class="m-0 text-danger-emphasis">
                    <li><b>{{subjectName}}</b> - This subject will be permanently deleted.</li>
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

        <div class="modal fade" id="editSubjectModal" tabindex="-1" aria-labelledby="editSubjectModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editSubjectModalLabel">Edit Subject - {{subjectId}}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="name" v-model="subjectFormData.name" placeholder="Subject Name" required>
                    <label for="name">Subject Name</label>
                </div>
                <div class="form-floating">
                    <textarea class="form-control" id="description" v-model="subjectFormData.description" placeholder="Description" style="height: 150px"></textarea>
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
    data() {
        return {
            subjectId: this.$route.params.id,
            subjectName: '',
            subjectDescription: '',
            chapters : [],
            formData: {
                name: '',
                description: '',
                subject_id: this.$route.params.id
            },
            addChaptererror: '',
            subjectFormData: {
                name: this.subjectName,
                description: this.subjectDescription
            },
            editSubjecterror: ''
        }
    },
    components: {
        ChapterCard
    },
    methods: {
        async fetchSubjectChapters() {
            const origin = window.location.origin;
            const url = `${origin}/api/subject/${this.subjectId}/chapters`;
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
                this.subjectName = data.name;
                this.subjectDescription = data.description;
                this.chapters = data.chapters;
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
                } else if (res.status === 404) {
                    this.$router.push("/");
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        async createChapter() {
            const origin = window.location.origin;
            const url = `${origin}/api/chapter`;
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
                const modalElement = document.getElementById("addChapterModal");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                this.fetchSubjectChapters();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
                }                
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        resetModal() {
            this.formData.name = "";
            this.formData.description = "";
            this.formData.subject_id = this.subjectId;
            this.addChaptererror = "";
        },

        async deleteSubject(){
            const origin = window.location.origin;
            const url = `${origin}/api/subject/${this.subjectId}`;
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                credentials: "same-origin", 
            });

            if (res.ok) {
                this.$router.push("/");
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        async editSubject() {
            const origin = window.location.origin;
            const url = `${origin}/api/subject/${this.subjectId}`;
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                body: JSON.stringify(this.subjectFormData),
                credentials: "same-origin",
            });

            if (res.ok) {
                this.resetSubjectModal();
                
                // Automatically close the modal after successful creation
                const modalElement = document.getElementById("editSubjectModal");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                this.fetchSubjectChapters();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
                }                
                const errorData = await res.json();
                console.error(errorData);
                this.editSubjecterror = errorData.message;
            }
        },

        resetSubjectModal() {
            this.formData.name = this.subjectName;
            this.formData.description = this.subjectDescription;
            this.editSubjecterror = "";
        },

        fillSubjectForm() {
            this.subjectFormData.name = this.subjectName;
            this.subjectFormData.description = this.subjectDescription;
        }
    },
    mounted() {
        this.fetchSubjectChapters();

        // Reset form and error when modal is closed
        const modalElement = document.getElementById("addChapterModal");
        modalElement.addEventListener("hidden.bs.modal", () => {
            this.resetModal();
        });
    }
}