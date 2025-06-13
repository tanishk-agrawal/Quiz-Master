import UserQuizStartsInTimer from "../components/UserQuizStartsInTimer.js";

export default{
    template:`
    <div class="row my-5 py-4">
        <div class="col d-flex justify-content-center align-items-center">
            <div class="card shadow-sm p-5" >
            <div class="d-flex justify-content-between mb-2">
                <div class="mb-2">                
                <span class="badge text-bg-warning bg-opacity-100 me-1">{{quiz.subject.name}}</span><i class="bi bi-caret-right-fill"></i>
                <span class="badge text-bg-warning bg-opacity-100 mx-1">{{quiz.chapter.name}}</span>
                </div>
                <span v-if="is_live()" class="badge text-danger border border-2 border-danger my-auto font-monospace fw-bold fs-6">⏺ LIVE</span>
            </div>

                <span class="h4">{{quiz.name}}</span>
                <div class="row mb-3 d-flex justify-content-center">
                    <div class="col-auto">
                    <table class="table table-sm w-auto">
                    <tbody>
                        <tr>
                            <th class="pe-3">Time Limit </th>
                            <td class="pe-3"> : </td>
                            <td> {{quiz.time_limit_formatted}}</td>
                        </tr>
                        <tr >
                            <th># Questions </th>
                            <td> : </td>
                            <td> {{quiz.number_of_questions}}  </td>
                        </tr>
                        <tr >
                            <th>Total Marks </th>
                            <td> : </td>
                            <td> {{quiz.total_marks}}  </td>
                        </tr>
                        <tr>
                            <th>Created On </th>
                            <td> : </td>
                            <td> {{quiz.created_on_formatted}} </td>
                        </tr>
                        <tr>
                            <th>Scheduled On </th>
                            <td> : </td>
                            <td>{{quiz.scheduled_on_formatted}} </td>
                        </tr>
                        
                    </tbody>
                    </table>
                    </div>
                    <div class="vr p-0 mx-2"></div>
                    <div class="col" v-if='quiz.instructions' ><b>Instructions</b><br><div style="white-space: pre-wrap; max-height: 220px; overflow-y: scroll">{{quiz.instructions}}</div></div><br>
                </div>
                <div class="d-flex justify-content-center">
                    <router-link :to="'/quiz/' + quiz.id + '/attempt'" class="btn btn-success fw-bold w-50" :class="{'disabled': !is_live()}">
                        <span v-if="is_quiz_ended()">Quiz Ended</span>
                        <span v-else-if="is_live()">Start Quiz</span>
                        <span v-else>Starts in <UserQuizStartsInTimer :scheduledOn="quiz.scheduled_on" @time-up="fetchQuiz"/></span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>`,
    data(){
        return{
            quiz:{}
        }
    },
    components: {
        UserQuizStartsInTimer
    },
    methods:{
        async fetchQuiz(){
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/${this.$route.params.id}/user`;
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
                console.log(this.quiz);
                this.checkAttempted();
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
                 this.$router.push("/quiz/"+this.$route.params.id+"/result");
                }
        },

        is_quiz_ended() {
            const scheduled_on = new Date(this.quiz.scheduled_on);
            const ends_on = new Date(scheduled_on.getTime() + (this.quiz.time_limit * 60 * 1000));
            return ends_on < new Date();
        },

        is_live(){
            const scheduled_on = new Date(this.quiz.scheduled_on);
            const ends_on = new Date(scheduled_on.getTime() + (this.quiz.time_limit * 60 * 1000));
            const now = new Date();
            console.log(scheduled_on, now, ends_on);
            return scheduled_on <= now && now <= ends_on;
        },
    },
    mounted(){
        this.fetchQuiz()
    }
}