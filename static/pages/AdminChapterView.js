import AdminQuizCard from "../components/AdminQuizCard.js";

export default {
    template: `
    <div>
        <div class="card  my-4 p-4">
        <div class="row">
            <div class="col">
                <router-link :to="'/admin/subject/' + subjectId" class=""><span class="badge text-bg-warning bg-opacity-100 mx-1">{{subjectName}}</span></router-link>
                
                <h3 class="my-2">{{chapterName}} </h3>
                <p class="my-2">{{chapterDescription}}</p>
            </div>
            <div class="vr p-0 mx-2"></div>
            <div class="col-auto d-flex flex-column justify-content-center">
                <button class="btn btn-primary btn-sm my-1" data-bs-toggle="modal" :data-bs-target="'#editChapterModal' + chapterId" @click="fillChapterForm"><i class="bi bi-pencil-square" ></i> &nbsp; Edit</button>
                <button class="btn btn-danger btn-sm my-1" data-bs-toggle="modal" :data-bs-target="'#deleteChapterModal' + chapterId"><i class="bi bi-trash-fill"></i> &nbsp; Delete</button>
            </div>
        </div>
        </div>

        <div class="row">
            <div class="col">
                <h4 class="fw-bold">Quizzes ({{quizzes.length}})</h4>
            </div>
            <div class="col my-auto text-end fw-bold">
                <a href="#" class="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" data-bs-toggle="modal" data-bs-target="#addQuizModal"><i class="bi bi-plus-circle"></i> Create  Quiz</a>
            </div>
        </div>
        <div v-if="quizzes.length == 0" class="text-center alert alert-warning fw-bold m-4">No Quizzes Found</div>
        <div v-else class="d-flex flex-wrap">
            <div v-for="quiz in quizzes">
                <AdminQuizCard :name="quiz.name" :instructions="quiz.instructions" :time_limit="quiz.time_limit" :time_limit_hhmm="quiz.time_limit_hhmm" :show="quiz.show" :created_on="quiz.created_on" :deadline="quiz.deadline" :number_of_questions="quiz.number_of_questions" :id="quiz.id" :subjectId="subjectId" :subjectName="subjectName" :chapterId="chapterId" :chapterName="chapterName" @change="fetchChapterQuizzes"></AdminQuizCard>
            </div>
        </div>


        <div class="modal fade" :id="'deleteChapterModal' + chapterId" tabindex="-1" aria-labelledby="deleteChapterModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="deleteChapterModalLabel"><i class="bi bi-exclamation-triangle-fill"></i> &nbsp; Are you sure?</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <ul class="m-0 text-danger-emphasis">
                    <li><b>{{chapterName}}</b> - This chapter will be permanently deleted.</li>
                    <li>All quizzes associated with this chapter will be deleted.</li>
                    <li>All quiz attempts within this chapter will be deleted.</li>
                    <li>This action cannot be undone.</li>
                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" @click="deleteChapter()" data-bs-dismiss="modal">Delete</button>
            </div>
            </div>
        </div>
        </div>

        <div class="modal fade" :id="'editChapterModal' + chapterId" tabindex="-1" aria-labelledby="editChapterModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editChapterModalLabel">Edit Chapter - {{chapterId}}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="name" v-model="chapterFormData.name" placeholder="Chapter Name" required>
                    <label for="name">Chapter Name</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="subname" v-model="subjectName" disabled readonly>
                    <label for="subname">Subject</label>
                </div>
                <div class="form-floating">
                    <textarea class="form-control" id="description" v-model="chapterFormData.description" placeholder="Description" style="height: 150px"></textarea>
                    <label for="description">Description</label>
                </div>
            </div>
            <div class="modal-footer justify-content-between">
                <span v-if="editChaptererror" class="text-danger text-capitalize">Error: {{ editChaptererror }}</span>
                <span v-else></span>
                <button type="button" class="btn btn-success" @click="editChapter()">Submit</button>
            </div>
            </div>
        </div>
        </div>

        <div class="modal fade" id="addQuizModal" tabindex="-1" aria-labelledby="addQuizModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="addQuizModalLabel">Add Quiz</h1>
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
                <span v-if="addQuizerror" class="text-danger text-capitalize">Error: {{ addQuizerror }}</span>
                <span v-else></span>
                <button type="button" class="btn btn-success" @click="createQuiz()">Submit</button>
            </div>
            </div>
        </div>
        </div>
    </div>
    `,
    data() {
        return {
            chapterId: this.$route.params.id,
            chapterName: '',
            chapterDescription: '',
            subjectId: null,
            subjectName: '',
            quizzes : [],

            chapterFormData: {
                name: this.chapterName,
                description: this.chapterDescription,
                subject_id: this.subjectId
            },
            editChaptererror: '',

            quizFormData: {
                name: '',
                instructions: '',
                time_limit_hhmm: '',
                deadline: null,                
                chapter_id: this.chapterId
            },
            addQuizerror: '',
        }
    },

    components: {
        AdminQuizCard
    },

    methods:{
        async fetchChapterQuizzes() {
            const origin = window.location.origin;
            const url = `${origin}/api/chapter/${this.chapterId}/quizzes`;
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
                this.chapterName = data.name;
                this.chapterDescription = data.description;
                this.subjectId = data.subject_id;
                this.subjectName = data.subject_name;
                this.quizzes = data.quizzes;
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

        async deleteChapter(){
            const origin = window.location.origin;
            const url = `${origin}/api/chapter/${this.chapterId}`;
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                credentials: "same-origin", 
            });

            if (res.ok) {
                this.$router.push("/admin/subject/"+this.subjectId);
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
        async editChapter() {
            const origin = window.location.origin;
            const url = `${origin}/api/chapter/${this.chapterId}`;
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                body: JSON.stringify(this.chapterFormData),
                credentials: "same-origin",
            });

            if (res.ok) {
                this.resetChapterModal();
                
                // Automatically close the modal after successful creation
                const modalElement = document.getElementById("editChapterModal"+this.chapterId);
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                this.fetchChapterQuizzes();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
                }                
                const errorData = await res.json();
                console.error(errorData);
                this.editChaptererror = errorData.message;
            }
        },

        resetChapterModal() {
            this.chapterFormData.name = this.chapterName;
            this.chapterFormData.description = this.chapterDescription;
            this.chapterFormData.subject_id = this.subjectId;
            this.editChaptererror = "";
        },

        fillChapterForm() {
            this.chapterFormData.name = this.chapterName;
            this.chapterFormData.description = this.chapterDescription; 
            this.chapterFormData.subject_id = this.subjectId;           
        },

        isValidHHMM(timeStr) {
            // Split the string by ':'
            const parts = timeStr.split(":");            
            // Check if there are exactly two parts
            if (parts.length !== 2) return false;            
            const [hours, minutes] = parts;            
            // Ensure both parts are numbers
            if (!/^-?\d+$/.test(hours) || !/^\d+$/.test(minutes)) return false;            
            const h = parseInt(hours, 10);
            const m = parseInt(minutes, 10);            
            // Validate the hour and minute range
            if (h < 0 || m <= 0 || m >= 60) return false;            
            return true;
        },

        async createQuiz() {
            if(!this.isValidHHMM(this.quizFormData.time_limit_hhmm)){
                this.addQuizerror = "Invalid Time Limit Format";
                return;
            }

            this.quizFormData.chapter_id = this.chapterId;
            const origin = window.location.origin;
            const url = `${origin}/api/quiz`;
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
                const modalElement = document.getElementById("addQuizModal");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                this.fetchChapterQuizzes();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
                }                
                const errorData = await res.json();
                console.error(errorData);
                console.log(this.quizFormData);
                this.addQuizerror = errorData.message;
            }
        },
        
        resetQuizModal(){
            this.quizFormData.name = '';
            this.quizFormData.instructions = '';
            this.quizFormData.time_limit_hhmm = '';
            this.quizFormData.deadline = null;
            this.quizFormData.chapter_id = this.chapterId;
            this.addQuizerror = '';
        }
    },

    mounted() {
        this.fetchChapterQuizzes();

        // Reset form and error when modal is closed
        const modalElement = document.getElementById("addQuizModal");
        modalElement.addEventListener("hidden.bs.modal", () => {
            this.resetQuizModal();
        });
    }
}


