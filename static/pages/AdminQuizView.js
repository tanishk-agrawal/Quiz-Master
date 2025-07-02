import AdminQuestionCard from "../components/AdminQuestionCard.js";

export default {
    template: `
    <div>
        <div class="card  my-4 p-4">
        <div class="row">
            <div class="col-auto">
                <router-link :to="'/admin/subject/' + subjectId" class=""><span class="badge text-bg-warning bg-opacity-100 mx-1">{{subjectName}}</span></router-link> <i class="bi bi-caret-right-fill"></i>
                <router-link :to="'/admin/chapter/' + chapterId" class=""><span class="badge text-bg-warning bg-opacity-100 mx-1">{{chapterName}}</span></router-link>
                
                <h3 class="my-2">{{quizName}} </h3>
                <table class="">
                <tr>
                    <th class="pe-3">Time Limit </th>
                    <td class="pe-3"> : </td>
                    <td> {{timeLimitFormat}}</td>
                </tr>
                <tr >
                    <th># Questions </th>
                    <td> : </td>
                    <td :class="numberOfQuestions == 0 ? 'text-danger fw-bold' : ''"> {{numberOfQuestions}}  </td>
                </tr>
                <tr >
                    <th>Total Marks </th>
                    <td> : </td>
                    <td> {{totMarks}}  </td>
                </tr>
                <tr>
                    <th>Created On </th>
                    <td> : </td>
                    <td> {{createdOn}} </td>
                </tr>
                <tr>
                    <th>Scheduled On </th>
                    <td> : </td>
                    <td>{{scheduledOnFormatted}}</td>
                </tr>
                </table>
            </div>
            <div class="vr p-0 mx-2"></div>
            <div class="col">
                <p class="my-2" v-if='quizInstructions' style="white-space: pre-wrap; max-height: 200px; overflow-y: scroll"><b>Instructions</b><br>{{quizInstructions}}</p>
            </div>
            <div class="vr p-0 mx-2"></div>
            <div class="col-auto d-flex flex-column justify-content-center">
                <button class="btn btn-primary btn-sm my-1" data-bs-toggle="modal" data-bs-target="#editQuizModal" @click='fillQuizForm'><i class="bi bi-pencil-square" ></i> &nbsp; Edit</button>
                <button class="btn btn-danger btn-sm my-1" data-bs-toggle="modal" data-bs-target="#deleteQuizModal"><i class="bi bi-trash-fill"></i> &nbsp; Delete</button>
                
                <div v-if="!numberOfQuestions" style="width: 100px;" >
                <span style="width: 100px;" class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Add questions to publish this quiz.">        
                    <button type="button" class="w-100 btn btn-success btn-sm my-1" disabled><i class="bi bi-eye-fill"></i> &nbsp; Publish </button>
                </span>
                </div>
                <div v-else @click="toggleShow" style="width: 100px;">
                    <button v-if="quizShow" type="button" class="w-100 btn border border-success text-success btn-sm my-1"><i class="bi bi-eye-slash-fill"></i> &nbsp; Hide </button>
                    <button v-else type="button" class="w-100 btn btn-success btn-sm my-1"><i class="bi bi-eye-fill"></i> &nbsp; Publish </button>
                </div>
                
            </div>
        </div>
        </div>

        <div class="row">
            <div class="col">
                <h4 class="fw-bold">Questions ({{questions.length}})</h4>
            </div>
            <div class="col my-auto text-end fw-bold">
                <a href="#" class="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" data-bs-toggle="modal" data-bs-target="#addQuestionModal"><i class="bi bi-plus-circle"></i> Add  Question</a>
            </div>
        </div>
        <div v-if="questions.length == 0" class="text-center alert alert-warning fw-bold m-4">No Questions Found</div>
        <div v-else class="">
            <div v-for="(question, index) in questions" :key="index">
                <AdminQuestionCard :question="question" :index="index" @change="fetchQuizQuestions"/>
            </div>
        </div>



        <div class="modal fade" id="deleteQuizModal" tabindex="-1" aria-labelledby="deleteQuizModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="deleteQuizModalLabel"><i class="bi bi-exclamation-triangle-fill"></i> &nbsp; Are you sure?</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <ul class="m-0 text-danger-emphasis">
                    <li><b>{{quizName}}</b> - This quiz will be permanently deleted.</li>
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

        <div class="modal fade" id="editQuizModal" tabindex="-1" aria-labelledby="editQuizModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editQuizModalLabel">Edit Quiz - {{quizId}}</h1>
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
                        <input type="datetime-local" class="form-control" id="schedule"  v-model="quizFormData.scheduled_on" placeholder="Schedule On" required>
                        <label for="schedule">Schedule On</label>
                    </div>            
                    <div class="col form-floating">
                        <input type="text" class="form-control" id="timeLimit" v-model="quizFormData.time_limit_hhmm" placeholder="Time Limit (hh:mm)" required>
                        <label for="timeLimit">Time Limit (hh:mm)</label>
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


        <div class="modal fade" id="addQuestionModal" tabindex="-1" aria-labelledby="addQuestionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="addQuestionModalLabel">Add Question</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-floating mb-2">
                    <textarea class="form-control" id="statement" v-model="questionFormData.statement" placeholder="statement" style="height: 100px"></textarea>
                    <label for="statement">Question Statement</label>
                </div>   
                <div class="form-floating mb-2">
                    <textarea class="form-control" id="hint" v-model="questionFormData.hint" placeholder="hint" ></textarea>
                    <label for="statement">Hint (optional)</label>
                </div>   

                <div class="input-group mb-2" v-for="i in questionFormData.no_options">
                    <div class="form-floating">
                        <input type="text" class="form-control" :placeholder="'Option ' + i" v-model="questionFormData.options[i-1].name" :id="i">
                        <label :for="i">Option {{i}}</label>
                    </div>
                    <div class="input-group-text px-3">
                        <input class="form-check-input" style="transform: scale(1.2);" type="radio" :value="i" name="answer" v-model="questionFormData.correct_option">
                    </div>
                </div>

                <div class="row gx-2 mb-2">            
                    <div class="col form-floating">
                        <input type="number" class="form-control" id="marks" v-model="questionFormData.marks" placeholder="Marks" required>
                        <label for="marks">Marks</label>
                    </div>
                    <div class="col form-floating">
                        <input type="text" class="form-control" id="answer" v-model="correctOption" placeholder="Correct Answer" disabled>
                        <label for="answer">Correct Answer</label>
                    </div>
                    <div class="col ">
                        <button @click="addOption()" class="text-center w-100 h-100 btn btn-link link-success link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover border-secondary-subtle">
                        <i class="bi bi-plus-circle"> Add  Option</i> </button>
                    </div>
                </div>
                <div class="form-floating ">
                    <textarea class="form-control" id="remark" v-model="questionFormData.remark" placeholder="remark"></textarea>
                    <label for="remark">Remark (optional)</label>
                </div> 
            </div>
            <div class="modal-footer justify-content-between">
                <span v-if="addQuestionerror" class="text-danger text-capitalize">Error: {{ addQuestionerror }}</span>
                <span v-else></span>
                <button type="button" class="btn btn-success" @click="createQuestion()">Submit</button>
            </div>
            </div>
        </div>
        </div>



    </div>
    `,
    data() {
        return {
            quizId: this.$route.params.id,
            quizName: '',
            quizInstructions: '',
            timeLimit: '',
            timeLimitHhmm: '',
            timeLimitFormat: '',
            quizShow: '',
            createdOn: '',
            scheduledOn: '',
            scheduledOnFormatted: '',
            numberOfQuestions: '',
            subjectId: '',
            subjectName: '',
            chapterId: '',
            chapterName: '',
            questions: [],

            quizFormData: {
                name: '',
                instructions: '',
                time_limit_hhmm: '',
                scheduled_on: '',
                chapter_id: null
            },
            editQuizerror: '',

            questionFormData: {
                statement: '',
                hint: '',
                marks: 1.0,
                remark: '',
                options: [{name: '', is_correct: false}, {name: '', is_correct: false}],
                no_options: 2,
                correct_option: null,
                quiz_id: this.quizId
            },
            
            addQuestionerror: '',
            nShow: false
        }
    },
    components: {
        AdminQuestionCard
    },computed: {
        totMarks() {
            let tot=0;
            for (let x of this.questions) {
                tot += x.marks;
            }
            return tot
        },
        correctOption(){
            if(this.questionFormData.correct_option === null) return ''; 
            return `Option ${this.questionFormData.correct_option}`;
        }
    },
    methods: {
        async fetchQuizQuestions() {
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/${this.quizId}/questions`;
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
                console.log(data);
                this.quizName = data.name;
                this.quizInstructions = data.instructions;
                this.timeLimit = data.time_limit;
                this.timeLimitHhmm = data.time_limit_hhmm;
                this.timeLimitFormat = data.time_limit_formatted;
                this.quizShow = data.show;
                this.createdOn = data.created_on_formatted;
                this.scheduledOn = data.scheduled_on;
                this.scheduledOnFormatted = data.scheduled_on_formatted;
                this.numberOfQuestions = data.number_of_questions;
                this.subjectId = data.subject_id;
                this.subjectName = data.subject_name;
                this.chapterId = data.chapter_id;
                this.chapterName = data.chapter_name;
                this.questions = data.questions;
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } else if (res.status === 404) {
                    this.$router.push("/");
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        async deleteQuiz() {
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/${this.quizId}`;
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                credentials: "same-origin", 
            });

            if (res.ok) {
                this.$router.push("/admin/chapter/"+this.chapterId);
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        fillQuizForm() {
            this.quizFormData.name = this.quizName;
            this.quizFormData.instructions = this.quizInstructions;
            this.quizFormData.time_limit_hhmm = this.timeLimitHhmm;
            this.quizFormData.scheduled_on = this.scheduledOn;
            this.quizFormData.chapter_id = this.chapterId;
        },

        async editQuiz() {
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/${this.quizId}`;
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
                this.editQuizerror = '';

                // Automatically close the modal after successful creation
                const modalElement = document.getElementById("editQuizModal");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                this.fetchQuizQuestions();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                }                
                const errorData = await res.json();
                console.error(errorData);
                this.editQuizerror = errorData.message;
            }
        },

        async createQuestion() {
            this.questionFormData.quiz_id = this.quizId;
            this.questionFormData.options[this.questionFormData.correct_option - 1].is_correct = true;
            console.log(this.questionFormData);

            const origin = window.location.origin;
            const url = `${origin}/api/question`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                body: JSON.stringify(this.questionFormData),
                credentials: "same-origin",
            });

            if (res.ok) {
                this.resetQuestionModal();
                
                // Automatically close the modal after successful creation
                const modalElement = document.getElementById("addQuestionModal");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                this.fetchQuizQuestions();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                }                
                const errorData = await res.json();
                console.error(errorData);
                console.log(this.quizFormData);
                this.addQuestionerror = errorData.message;
            }
        },

        resetQuestionModal() {
            this.questionFormData.statement = '';
            this.questionFormData.hint = '';
            this.questionFormData.options = [{name: '', is_correct: false}, {name: '', is_correct: false}];
            this.questionFormData.no_options = 2;
            this.questionFormData.correct_option = null;
            this.questionFormData.marks = 1.0;
            this.questionFormData.remark = '';
            this.questionFormData.quiz_id = this.quizId;
            this.addQuestionerror = '';
        },

        addOption() {
            this.questionFormData.no_options += 1;
            this.questionFormData.options.push({name: '', is_correct: false});
        },

        async toggleShow() {
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/${this.quizId}/toggle-show`;
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
                console.log(data);
                this.quizShow = data.show;
            }
        },

        enableTooltips() {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        },

    },
    mounted() {
        this.fetchQuizQuestions();

        // Reset form and error when modal is closed
        const modalElement = document.getElementById("addQuestionModal");
        modalElement.addEventListener("hidden.bs.modal", () => {
            this.resetQuestionModal();
        });

        this.enableTooltips();
    }
}