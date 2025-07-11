import ChartSubjectPerformance from '../components/ChartSubjectPerformance.js'
import ChartTimeVsScore from '../components/ChartTimeVsScore.js'

export default{
    template : `
    <div>
        <div class="row my-3 font-monospace fw-bold">
            <div class="col card shadow-sm p-3 me-2 fs-5">
                <span class="bi bi-person-vcard"> {{user.username}}</span>
                <span class="bi bi-envelope-at-fill"> {{user.email}}</span>
            </div>
            <div class="col card shadow-sm p-3 mx-2">
                <span class="fs-3">{{user.no_of_quizzes}}</span>
                <span class="">Quizzes Attempted</span>
            </div>
            <div class="col card shadow-sm p-3 ms-2">
                <span class="fs-3">{{user.average}}%</span>
                <span class="">Overall Performance</span>
            </div>
        </div>
        <div class="row my-3" >
            <ChartTimeVsScore :isAdmin="true" class="col me-2"/>
            <ChartSubjectPerformance :isAdmin="true" class="col ms-2"/> 
        </div>
        
        <div class="row mt-2 card shadow-sm rounded-2 p-3 text-center">
            <table class="table table-hover my-1">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Quiz Name</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Chapter</th>
                        <th scope="col">Submitted on</th>
                        <th scope="col">Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="attempt, index in attempts" class="">
                        <th scope="row">{{index + 1}}</th>
                        <td>{{attempt.quiz.name}}</td>
                        <td>{{attempt.quiz.subject.name}}</td>
                        <td>{{attempt.quiz.chapter.name}}</td>
                        <td>{{attempt.submitted_at}}</td>
                        <td><div class="progress my-1 position-relative fw-bold" role="progressbar">
                                <div class="progress-bar fw-bold" :style="progressStyle(attempt.percentage)"></div>
                                <div class="position-absolute top-50 start-50 translate-middle" :class="attempt.percentage < 80 ? 'text-black' : 'text-white'">{{attempt.percentage}}%</div>
                        </div></td>
                    </tr>
                </tbody>
            </table>
        </div>
              

    </div>
    `,
    data(){
        return{
            attempts : [],
            user : {},
        }
    },
    components: {
        ChartSubjectPerformance,
        ChartTimeVsScore
    },
    methods:{
        async fetchUser() {
            const origin = window.location.origin;
            const url = `${origin}/api/user-performance/${this.$route.params.id}`;
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
                this.user = data;
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } 
                const errorData = await res.json();
                console.error(errorData);
            }
        },
        async fetchHistory(){
            const origin = window.location.origin;
            const url = `${origin}/api/user/history?user_id=${this.$route.params.id}`; 
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
                this.attempts = data;
                console.log(this.attempts);
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

        progressStyle(percent) {
            let color = "#198754";
            if (percent < 30){color = "#dc3545";}
            else if (percent < 60){color = "#ffc107";}
            else if (percent < 80){color = "#bbdc35";}

            return {
                backgroundColor: color,
                width: percent + '%'
            };
        }
    },
    mounted() {
        this.fetchUser();
        this.fetchHistory();
    }
}