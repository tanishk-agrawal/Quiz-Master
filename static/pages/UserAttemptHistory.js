import ProfileCard from '../components/ProfileCard.js'
import DateTimeCard from '../components/DateTimeCard.js'

export default{
    template : `
    <div>
        <div class="row my-3 gx-3" >
            <div class="col">
                <ProfileCard></ProfileCard>
            </div>
            <div class="col-auto">
                <DateTimeCard></DateTimeCard>
            </div>
        </div>
        <hr>
        <div class="row mt-4">
            <div class="col">
                <h3 class="fw-bold">Attempt History </h3>
            </div>
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
                        <th scope="col">Marks Scored</th>
                        <th scope="col">Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="attempt, index in attempts" class="" style="cursor: pointer;" @click="$router.push('/quiz/' + attempt.quiz.id + '/result')">
                        <th scope="row">{{index + 1}}</th>
                        <td>{{attempt.quiz.name}}</td>
                        <td>{{attempt.quiz.subject.name}}</td>
                        <td>{{attempt.quiz.chapter.name}}</td>
                        <td>{{attempt.submitted_at}}</td>
                        <td>{{attempt.marks_scored}}/{{attempt.max_marks}}</td>
                        <td><div class="progress my-1 position-relative fw-bold" role="progressbar">
                                <div class="progress-bar fw-bold" :style="progressStyle(attempt.percentage)"> {{attempt.percentage}}% </div>
                                <div class="position-absolute top-50 start-50 translate-middle" v-if="attempt.percentage <= 0">{{attempt.percentage}}%</div>
                        </div></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,
    data(){
        return{
            attempts : []
        }
    },
    components: {
        ProfileCard,
        DateTimeCard,
    },
    methods:{

        async fetchHistory(){
            const origin = window.location.origin;
            const url = `${origin}/api/user/history`; 
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
                } 
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        progressStyle(percent) {
            let color = "#198754";
            let textColor = "white";
            if (percent < 30){textColor = "white"; color = "#dc3545";}
            else if (percent < 60){textColor = "black"; color = "#ffc107";}
            else if (percent < 80){textColor = "black"; color = "#bbdc35";}

            return {
                backgroundColor: color,
                color: textColor,
                width: percent + '%'
            };
        }
    },
    mounted() {
        this.fetchHistory();
    }
}