export default {
    template: `
    <div>
    <div class="card shadow-sm m-2" :class="{'border-danger border-2': !show}" style="width: 16rem;">
        <div class="card-body">
        <router-link :to="'/admin/quiz/' + id" class="link-dark link-underline-opacity-0">
            <h5 class="card-title">{{name}}</h5>
        </router-link>   
        <p class="card-text">
        <small class="text-dark">
            <ul style="list-style-type:none; margin:0; padding:0">
                <li>Questions : <span :class="{'text-danger fw-bold': number_of_questions == 0}">{{number_of_questions}}</span></li>
                <li>Created on : {{formattedDate}}</li>
            </ul>
        </small>
        </p>

        </div>
        <div class="card-footer fw-bold d-flex justify-content-between">
            <router-link :to="'/admin/quiz/' + id" class="link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover"><i class="bi bi-box-arrow-up-right"></i> View </router-link>
            <a href="#" class="link-primary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover" data-bs-toggle="modal" :data-bs-target="'#editQuizModal' + id"><i class="bi bi-pencil-square"></i> Edit</a>
            <a href="#" class="link-danger link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover " data-bs-toggle="modal" :data-bs-target="'#deleteQuizModal' + id"><i class="bi bi-trash"></i> Delete</a>
        </div>
    </div>

        <div class="modal fade" :id="'deleteQuizModal' + id" tabindex="-1" aria-labelledby="deleteQuizModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="deleteQuizModalLabel"><i class="bi bi-exclamation-triangle-fill"></i> &nbsp; Are you sure?</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <ul class="m-0 text-danger-emphasis">
                    <li><b>{{name}}</b> - This quiz will be permanently deleted.</li>
                    <li>All the attempts of this quiz will be deleted.</li>
                    <li>This action cannot be undone.</li>
                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" @click="deleteQuiz()" data-bs-dismiss="modal">Delete</button>
            </div>
            </div>
        </div>
        </div>

        <div class="modal fade" :id="'editQuizModal' + id" tabindex="-1" aria-labelledby="editQuizModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editQuizModalLabel">Edit Quiz - {{id}}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="name" v-model="quizFormData.name" placeholder="Quiz Name" required>
                    <label for="name">Quiz Name</label>
                </div>
                <div class="row mb-2 gx-2">
                    <div class="col form-floating">
                        <input type="text" class="form-control" id="subName" v-model="subjectName" disabled readonly>
                        <label for="subName">Subject</label>
                    </div>
                    <div class="col form-floating">
                        <input type="text" class="form-control" id="chName" v-model="chapterName" disabled readonly>
                        <label for="chName">Chapter</label>
                    </div>
                </div>
                <div class="form-floating mb-2">
                    <textarea class="form-control" id="instructions" v-model="quizFormData.instructions" placeholder="Instructions" style="height: 150px"></textarea>
                    <label for="instructions">Instructions</label>
                </div> 
                <div class="row gx-2">            
                    <div class="col form-floating">
                        <input type="text" class="form-control" id="timeLimit" v-model="quizFormData.time_limit_hhmm" placeholder="Time Limit (hh:mm)" required>
                        <label for="timeLimit">Time Limit (hh:mm)</label>
                    </div>
                    <div class="col form-floating">
                        <input type="datetime-local" class="form-control" id="deadline"  v-model="quizFormData.deadline" placeholder="Deadline (optional)" required>
                        <label for="deadline">Deadline (optional)</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer justify-content-between">
                <span v-if="editQuizerror" class="text-danger text-capitalize">Error: {{ editQuizerror }}</span>
                <span v-else></span>
                <button type="button" class="btn btn-success" @click="editQuiz()">Submit</button>
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
        instructions: {
            type: String,
            required: true
        },
        time_limit: {
            type: Number,
            required: true
        },
        time_limit_hhmm: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            required: true
        },
        created_on: {
            type: String,
            required: true
        },
        deadline: {
            type: String
        },
        number_of_questions: {
            type: Number,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        subjectId: {
            type: Number,
            required: true
        },
        subjectName: {
            type: String,
            required: true
        },
        chapterId: {
            type: String,
            required: true 
        },
        chapterName: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            quizFormData: {
                name: this.name,
                instructions: this.instructions,
                time_limit_hhmm: this.time_limit_hhmm,
                deadline: this.deadline,
                chapter_id: this.chapterId
            },
            editQuizerror: "",
        }
    },
    computed: {
        formattedDate() {
            return new Date(this.created_on).toLocaleString('en-IN');
        },
    },
    methods: {
        async deleteQuiz() {
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/${this.id}`;
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
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        async editQuiz() {
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/${this.id}`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                body: JSON.stringify(this.quizFormData),
                credentials: "same-origin",
            });

            if (res.ok) {
                this.resetQuizModal();
                
                // Automatically close the modal after successful creation
                const modalElement = document.getElementById("editQuizModal"+this.id);
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                this.$emit("change");
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
                }                
                const errorData = await res.json();
                console.error(errorData);
                this.editQuizerror = errorData.message;
            }
        },

        resetQuizModal() {
            this.quizFormData.name = this.name;
            this.quizFormData.instructions = this.instructions;
            this.quizFormData.time_limit_hhmm = this.time_limit_hhmm;
            this.quizFormData.deadline = this.deadline;

            this.editQuizerror = "";
        }

    },
    mounted() {
         // Reset form and error when modal is closed
         const modalElement = document.getElementById("editQuizModal"+this.id);
         modalElement.addEventListener("hidden.bs.modal", () => {
             this.resetQuizModal();
         });
    }
}