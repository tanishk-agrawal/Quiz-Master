import UserQuizInfo from "../components/UserQuizInfo.js";
import UserQuizTimer from "../components/UserQuizTimer.js";

export default{
    template: `
    <div>
        <div class="card shadow-sm m-4 p-2 sticky-top bg-body-tertiary">
            <div class="row text-center px-2">
                <div class="col text-start my-auto">
                    <span class="h4 fw-bold me-3"> {{quiz.name}}</span> 
                    <a href="#"  class="dropdown link-primary h5" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-info-circle"></i></a>
                    <div  class="dropdown-menu p-0"><UserQuizInfo :quiz="quiz"></UserQuizInfo></div>
                </div>
                <div class="col-auto">
                    <UserQuizTimer v-if="quiz && quiz.time_limit" :totalTime="timeRemaining" @time-up="timeUp"></UserQuizTimer>
                </div>
                <div class="col my-auto text-end"><button class="btn btn-success fw-medium w-50" @click="submit">
                <span v-if="submitLoading" class="spinner-border spinner-border-sm text-light" role="status"></span> <span v-else>Submit</span>
                </button></div>
            </div>
        </div>

        <div>
            <div class="mx-5" v-for="(question, index) in quiz.questions" :key="index">
                <div class="card shadow-sm my-3">
                    <div class="card-header d-flex justify-content-between fw-bold ">
                        <span class="">Question {{index + 1}}</span>
                        <span class="fst-italic">{{question.marks}} points</span>
                        <button @click="clearResponse(index, question)" class="btn btn-link link-primary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover p-0">Clear Response</button>
                    </div>
                    <div class="card-body px-5">
                        <div class="card-text fw-medium">{{question.statement}}</div>
                        <small class="card-text text-muted" v-if="question.hint"><b> Hint : </b>{{question.hint}}</small>
                        <div :id="'options' + index" class="card-text mt-3 px-4" >
                            <div class="mb-2" v-for="option in question.options">
                                <input class="btn-check" type="radio" :name="index+'options'" :id="option.id" :value="option.id" v-model="attemptFormData.submissions[question.id]">
                                <label :class="optionBtnStyle" :for="option.id">{{option.name}}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            quiz:{},
            timelimit : 60,
            optionBtnStyle : "btn btn-outline-warning w-100 text-start text-dark border-dark",
            submitLoading : false,
            attemptFormData : {
                started_at : null,
                quiz_id : this.$route.params.id,
                submissions : {}
            }
        }
    },
    computed:{
        timeRemaining(){
            const scheduled_on = new Date(this.quiz.scheduled_on);
            const ends_on = new Date(scheduled_on.getTime() + (this.quiz.time_limit * 60 * 1000));
            const now = new Date();
            console.log('time', scheduled_on, now, ends_on);
            return Math.floor((ends_on - now) / 1000);
        }
    },
    components: {
        UserQuizInfo,
        UserQuizTimer
    },
    methods:{
        async fetchQuiz(){
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/${this.$route.params.id}/user/attempt`; 
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
                this.quiz = data;
                if (this.checkAttempted()) return;
                this.populateAttemptFormData();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } else if (res.status === 404) {
                    this.$router.push("/404");
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        checkAttempted(){
            if(this.quiz.attempted){
                console.log(this.quiz.attempted);
                this.$router.push("/quiz/"+this.$route.params.id+"/result");
                return true;
                }
        },

        
        timeUp(){
            alert("Time's Up ⏰");
            this.submit();
        },

        async submit(){
            this.submitLoading = true;
            console.log(this.attemptFormData);

            const origin = window.location.origin;
            const url = `${origin}/api/quiz/${this.$route.params.id}/user/attempt`; 
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(this.attemptFormData),
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("token")
                },
                credentials: "same-origin",
            });

            if (res.ok) {
                const data = await res.json();
                console.log(data);

                localStorage.removeItem("attempting");
                localStorage.removeItem("timelimit");
                setTimeout(() => {
                    this.submitLoading = false;
                    this.$router.push("/quiz/"+this.$route.params.id+"/result");
                }, 200);  
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } 
                const errorData = await res.json();
                console.error(errorData);
                this.submitLoading = false;
            }          
        },

        populateAttemptFormData(){
            this.attemptFormData.started_at = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
            for (let question of this.quiz.questions) {
                this.attemptFormData.submissions[question.id] = null;                
            }            
        },

        clearResponse(index, question){
            document.querySelector(`input[name="${index}options"]:checked`).checked = false;
            this.attemptFormData.submissions[question.id] = null;
        }

    },
    mounted(){
        this.fetchQuiz()
        
    }
}