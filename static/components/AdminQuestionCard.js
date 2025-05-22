export default {
    template: `
    <div>
    <div class="card shadow-sm m-3">
        <div class="card-header d-flex justify-content-between fw-bold ">
            <span class="">Q{{index + 1}}</span>
            <span class="fst-italic">{{question.marks}} points</span>
            <div class="">
                <a href="#" class="mx-2 link-primary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover" data-bs-toggle="modal" :data-bs-target="'#editQuestionModal' + question.id"><i class="bi bi-pencil-square"></i> Edit</a>
                <a href="#" class="mx-2 link-danger link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover " data-bs-toggle="modal" :data-bs-target="'#deleteQuestionModal' + question.id"><i class="bi bi-trash"></i> Delete</a>
            </div>
        </div>
        <div class="card-body">
            <div class="card-text fw-medium">{{question.statement}}</div>
            <p class="card-text" v-if="question.hint">Hint : {{question.hint}}</p>
            <div :id="'options' + index" class="card-text mt-3 px-5" >
                <div class="mb-2" v-for="option in question.options">
                    <div :id="option.id" class="btn w-100 text-start border-secondary rounded-2 d-flex justify-content-between" :class="option.is_correct ? 'bg-success-subtle text-success-emphasis' : ''" disabled>
                    <span>{{option.name}}</span> <span class="bi bi-check-circle-fill" v-if="option.is_correct"></span></div>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <small class="card-text" v-if="question.remark">Remark : {{question.remark}}</small>
        </div>
    </div>
    
        
        <div class="modal fade" :id="'deleteQuestionModal' + question.id" tabindex="-1" aria-labelledby="deleteQuestionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="deleteQuestionModalLabel"><i class="bi bi-exclamation-triangle-fill"></i> &nbsp; Are you sure?</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <ul class="m-0 text-danger-emphasis">
                    <li>This question will be permanently deleted.</li>
                    <li>This action cannot be undone.</li>
                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" @click="deleteQuestion()" data-bs-dismiss="modal">Delete</button>
            </div>
            </div>
        </div>
        </div>


        <div class="modal fade" :id="'editQuestionModal' + question.id" tabindex="-1" aria-labelledby="editQuestionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editQuestionModalLabel">Edit Question {{question.id}}</h1>
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
                <span v-if="editQuestionerror" class="text-danger text-capitalize">Error: {{ editQuestionerror }}</span>
                <span v-else></span>
                <button type="button" class="btn btn-success" @click="editQuestion()">Submit</button>
            </div>
            </div>
        </div>
        </div>


    </div>
    `,
    props: {
        question: {
          type: Object,
          required: true,
        },
        index: {
          type: Number,
          required: true,
        },
    },
    data() {
        return {
            questionFormData: {},
            editQuestionerror: '',
        };
    },
    
    created() {
        this.questionFormData = {
            statement: this.question.statement || '',
            hint: this.question.hint || '',
            marks: this.question.marks || 0,
            remark: this.question.remark || '',
            options: JSON.parse(JSON.stringify(this.question.options)) || [{name: '', is_correct: false}, {name: '', is_correct: false}],
            no_options: this.question.options.length || 0,
            correct_option: this.question.correct_option || null,
            quiz_id: this.question.quiz_id || null
        };
    },
    
    computed: {
        correctOption() {
            if(!this.questionFormData.correct_option) return ''; 
            return `Option ${this.questionFormData.correct_option}`;
        },
    },

    methods: {
        async deleteQuestion() {
            const origin = window.location.origin;
            const url = `${origin}/api/question/${this.question.id}`;
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

        async editQuestion() {
            console.log(this.questionFormData)
            const origin = window.location.origin;
            const url = `${origin}/api/question/${this.question.id}`;
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
                const modalElement = document.getElementById("editQuestionModal"+this.question.id);
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
                this.editQuestionerror = errorData.message;
            }
        },

        resetQuestionModal() {
            this.questionFormData = {
                statement: this.question.statement,
                hint: this.question.hint,
                marks: this.question.marks,
                remark: this.question.remark,
                options: JSON.parse(JSON.stringify(this.question.options)), // Deep copy
                no_options: this.question.options.length,
                correct_option: this.question.correct_option,
                quiz_id: this.question.quiz_id
            },
            this.editQuestionerror = ''
        },

        addOption() {
            this.questionFormData.options.push({name: '', is_correct: false});
            this.questionFormData.no_options += 1;
        },
        
    },
    mounted() {
        // Reset form and error when modal is closed
        const modalElement = document.getElementById("editQuestionModal"+this.question.id);
        modalElement.addEventListener("hidden.bs.modal", () => {
            this.resetQuestionModal();
        });
   }
}