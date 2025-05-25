export default{
    template: `
    <div> 
        <div class="mt-4 card shadow-sm p-3">
            <div class="row  g-4 ">
                <div class="col text-center ">
                    <div class="row mb-3 text-start">
                        <div class="col"><span class="h3 fw-bold"> {{result.quiz.name}}</span></div>                  
                    </div>  
                    <div class="row align-middle">     
                        <div class="col "> 
                            <div class="mt-2 fs-4 fst-italic fw-medium">You scored <br>
                            <span class="display-5 fw-medium">{{result.marks_scored}}</span> 
                            <span class="fs-2">/ {{result.max_marks}}</span></div> 
                        </div> 
                    </div> 
                </div>
                <div class="col ">
                    <div class=" d-flex justify-content-center align-items-center">
                        <div class="rounded-circle bg-success d-flex justify-content-center align-items-center" 
                        style="width: 200px; height: 200px; !important" :style="percentageStyle">
                            <span class="rounded-circle bg-light d-flex justify-content-center align-items-center display-5 fw-bold" 
                            style="width: 150px; height: 150px;">{{result.percentage}}%</span>
                        </div>
                    </div>                    
                </div>
                <div class="col ">
                    <div class="row fw-bold mt-2 fs-5">
                        <div class="col card p-2 text-center text-primary mx-2">Total Questions<div class="fs-3">{{result.questions.length}}</div></div>
                        <div class="col card p-2 text-center text-success mx-2">Correct<div class="fs-3">{{nCorrect}}</div></div>
                    </div>
                    <div class="row fw-bold mt-2 fs-5">
                        <div class="col card p-2 text-center text-danger mx-2">Incorrect<div class="fs-3">{{nIncorrect}}</div> </div>
                        <div class="col card p-2 text-center text-secondary mx-2">Unattempted<div class="fs-3">{{nUnattempted}}</div></div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div class="mx-5" v-for="(question, index) in result.questions" :key="index">
                <div class="card shadow-sm my-4 border"
                :class="question.is_correct ? 'border-success' : question.selected_option_id ? 'border-danger' : 'border-secondary'">
                    <div class="card-header d-flex justify-content-between fw-bold" 
                        :class="question.is_correct ? 'bg-success-subtle text-success-emphasis' : question.selected_option_id ? 'bg-danger-subtle text-danger-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'">
                        <span class="">Question {{index + 1}}</span>
                        <span class="fst-italic">{{question.marks}} points</span>
                        <span class="border border-secondary rounded-2 px-2">
                            <span v-if="question.is_correct" class="">Correct</span>
                            <span v-else-if="question.selected_option_id" class="">Incorrect</span>
                            <span v-else class="">Unattempted</span>
                        </span>
                    </div>
                    <div class="card-body px-5">
                        <div class="card-text fw-medium">{{question.statement}}</div>
                        <small class="card-text text-muted" v-if="question.hint"><b> Hint : </b>{{question.hint}}</small>
                        <div :id="'options' + index" class="card-text mt-3 px-4" >
                            <div class="mb-2" v-for="option in question.options">
                                <div v-if="option.is_correct">
                                    <div :id="option.id" class="btn w-100 text-start border-secondary rounded-2 d-flex justify-content-between bg-success-subtle text-success-emphasis" disabled>
                                    <span>{{option.name}}</span> <span class="bi bi-check-circle-fill"></span></div>
                                </div>
                                <div v-else-if="option.is_selected">
                                    <div :id="option.id" class="btn w-100 text-start border-secondary rounded-2 d-flex justify-content-between bg-danger-subtle text-danger-emphasis" disabled>
                                    <span>{{option.name}}</span> <span class="bi bi-x-circle-fill"></span></div>
                                </div>
                                <div v-else>
                                    <div :id="option.id" class="btn w-100 text-start border-secondary rounded-2 d-flex justify-content-between" disabled>
                                    <span>{{option.name}}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <small class="card-text" v-if="question.remark">Remark : {{question.remark}}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            result:{},
        }
    },

    computed: {
        percentageStyle() {
            let percent = this.result.percentage;
            let color = "#198754";
            if (percent < 30) color = "#dc3545";
            else if (percent < 60) color = "#ffc107";
            else if (percent < 80) color = "#bbdc35";

            return `background: conic-gradient( ${color} calc(${percent} * 1%), #e9ecef 0%);`
        },

        nCorrect() {
            return this.result.questions.filter((question) => question.is_correct).length;
        },

        nIncorrect() {
            return this.result.questions.filter((question) => !question.is_correct && question.selected_option_id).length;
        },

        nUnattempted() {
            return this.result.questions.filter((question) => !question.selected_option_id).length;
        },
    },

    methods:{
        async fetchResult(){
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/${this.$route.params.id}/user/result`; 
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
                this.result = data;
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
                } else if (res.status === 404) {
                    this.$router.push("/404");
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },
    },

    mounted(){
        this.fetchResult();
    }
}
