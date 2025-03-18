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
            <ol type="A" class="card-text">
                <li>{{question.option_a}}</li>
                <li>{{question.option_b}}</li>
                <li v-if="question.option_c">{{question.option_c}}</li>
                <li v-if="question.option_d">{{question.option_d}}</li>
            </ol>
        </div>
        <div class="card-footer">
            <small class="card-text fw-bold text-success">Correct Answer : {{question.answer}}</small><br>
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

                <div class="input-group mb-2">
                    <span class="input-group-text">(a)</span>
                    <input type="text" class="form-control" placeholder="Option (a)*" v-model="questionFormData.option_a">
                    <div class="input-group-text">
                        <input class="form-check-input mt-0" type="radio" value="A" name="answer" v-model="questionFormData.answer" :disabled="!questionFormData.option_a">
                    </div>
                </div>
                <div class="input-group mb-2">
                    <span class="input-group-text">(b)</span>
                    <input type="text" class="form-control" placeholder="Option (b)*" v-model="questionFormData.option_b" :disabled="!questionFormData.option_a">
                    <div class="input-group-text">
                        <input class="form-check-input mt-0" type="radio" value="B" name="answer" v-model="questionFormData.answer" :disabled="!questionFormData.option_b">
                    </div>
                </div>
                <div class="input-group mb-2">
                    <span class="input-group-text">(c)</span>
                    <input type="text" class="form-control" placeholder="Option (c)" v-model="questionFormData.option_c" :disabled="!questionFormData.option_b">
                    <div class="input-group-text">
                        <input class="form-check-input mt-0" type="radio" value="C" name="answer" v-model="questionFormData.answer" :disabled="!questionFormData.option_c">
                    </div>
                </div>
                <div class="input-group mb-2">
                    <span class="input-group-text">(d)</span>
                    <input type="text" class="form-control" placeholder="Option (d)" v-model="questionFormData.option_d" :disabled="!questionFormData.option_c">
                    <div class="input-group-text">
                        <input class="form-check-input mt-0" type="radio" value="D" name="answer" v-model="questionFormData.answer" :disabled="!questionFormData.option_d">
                    </div>
                </div>

                <div class="row gx-2 mb-2">            
                    <div class="col form-floating">
                        <input type="number" class="form-control" id="marks" v-model="questionFormData.marks" placeholder="Marks" required>
                        <label for="marks">Marks</label>
                    </div>
                    <div class="col form-floating">
                        <select class="form-select" id="correctOption" v-model="questionFormData.answer" disabled readonly>
                            <option value="A">Option (a)</option>
                            <option value="B">Option (b)</option>
                            <option value="C">Option (c)</option>
                            <option value="D">Option (d)</option>
                        </select>
                        <label for="correctOption">Correct Answer</label>
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
            option_a: this.question.option_a || '',
            option_b: this.question.option_b || '',
            option_c: this.question.option_c || '',
            option_d: this.question.option_d || '',
            answer: this.question.answer || '',
            remark: this.question.remark || '',
            quiz_id: this.question.quiz_id || null
        };
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
                option_a: this.question.option_a,
                option_b: this.question.option_b,
                option_c: this.question.option_c,
                option_d: this.question.option_d,
                answer: this.question.answer,
                remark: this.question.remark,
                quiz_id: this.question.quiz_id
            },
            this.editQuestionerror = ''
        }
        
    },
    mounted() {
        // Reset form and error when modal is closed
        const modalElement = document.getElementById("editQuestionModal"+this.question.id);
        modalElement.addEventListener("hidden.bs.modal", () => {
            this.resetQuestionModal();
        });
   }
}