import ProfileCard from '../components/ProfileCard.js'
import DateTimeCard from '../components/DateTimeCard.js'
import UserQuizCard from '../components/UserQuizCard.js'
import UserSubjectCard from '../components/UserSubjectCard.js'

export default {
    template: `
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
        <div class="row">
            <div class="col">
            <h3 class="fw-bold">Quizzes</h3>
            </div>
            <div class="col my-auto text-end fw-bold">
            <router-link to="/quiz/all" class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"> See All 🡲</router-link>
            </div>
        </div>
        
        <div class="row" v-if='quizzes.length === 0' class="text-center alert alert-warning fw-bold m-4">No Live or Upcoming Quizzes Found</div>
        <div class="row gx-0" v-else>
            <div class="col-auto"  v-for="quiz in quizzes.slice(0, 5)">
                <UserQuizCard :quiz="quiz" :showHeader="true"></UserQuizCard>
            </div>
        </div>
        <hr>  
        
        <div class="row">
            <div class="col">
            <h3 class="fw-bold">Subjects</h3>
            </div>
        </div>
        <div v-if="subjects.length == 0" class="text-center alert alert-warning fw-bold m-4">No Subjects Found</div>
        <div class="d-flex flex-wrap" v-else>
            <div v-for="subject in subjects" >
                <UserSubjectCard :subject="subject"></UserSubjectCard>
            </div>
        </div>
    </div>
    `,
    components: {
        ProfileCard,
        DateTimeCard,
        UserQuizCard,
        UserSubjectCard
    },
    data() {
        return {
            quizzes: [],
            subjects: []
        }
    },

    methods: {
        async fetchRecentQuizzes() {
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/get?n=5`;
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
                this.quizzes = data.upcoming;
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } else if (res.status === 404) {
                    this.quizzes = [];
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },
        async fetchSubjects() {
            const origin = window.location.origin;
            const url = `${origin}/api/subject`;
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
                this.subjects = data;
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } else if (res.status === 404) {
                    this.subjects = [];
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },
    },

    mounted() {
        this.fetchRecentQuizzes();
        this.fetchSubjects();
    }
}