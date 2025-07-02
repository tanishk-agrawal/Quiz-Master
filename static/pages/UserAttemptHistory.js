import ProfileCard from '../components/ProfileCard.js'
import DateTimeCard from '../components/DateTimeCard.js'

export default{
    template : `
    <div>
        <div class="toast align-items-center position-absolute border border-dark" style="top: 50px; right:10px; z-index: 5" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex fw-bold">
                <div class="toast-body text-info-emphasis" v-if="toast==1">
                    <div class="spinner-border spinner-border-sm me-2" role="status"><span> </span>
                </div>Export Initiated...</div>
                <div class="toast-body text-success" v-if="toast==2"><i class="bi bi-check-circle-fill me-2"></i> Export Successful...</div>
            </div>
        </div> 
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
            <div class="col my-auto text-end fw-bold">
            <a href="#" @click="exportCSV" class="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"><i class="bi bi-download"></i> Export CSV</a>
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
            toast : 0,
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

        async exportCSV(){
            this.toast = 1;
            const toast = document.querySelector('.toast');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
            toastBootstrap.show();

            const origin = window.location.origin;
            const url = `${origin}/api/export-csv`; 
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem("token")
                },
                credentials: "same-origin"
            })
            if (res.ok) {
                const data = await res.json();                
                setTimeout(() => this.getCSV(data.id), 1000);
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } 
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        getCSV(id){
            this.toast = 2;
            const toast = document.querySelector('.toast');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
            toastBootstrap.show();
            window.location.href = '/api/get-csv/' + id;
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
        this.fetchHistory();
    }
}