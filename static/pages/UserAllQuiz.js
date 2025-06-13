import UserQuizCard from "../components/UserQuizCard.js"

export default{
    template:`
    <div>
        <div class="row mt-4">
            <div class="col">
            <h3 class="fw-bold">Quizzes</h3>
            </div>
            <div class="col my-auto d-flex justify-content-end">
            <input type="text" id="search" placeholder=" 🔍︎ Search" class="border-2 form-control" style="max-width:350px">
            </div>
        </div>
        <hr>
        <div class="row" v-if='quizzes.upcoming.length == 0 && quizzes.past.length == 0' class="text-center alert alert-warning fw-bold m-4">No Quizzes Found</div>
        <div class="row gx-1" v-if='quizzes.upcoming.length > 0'>
            <h4>Live & Upcoming</h4>
            <div class="col-auto" v-for="quiz in quizzes.upcoming">
                <UserQuizCard :quiz="quiz" :showHeader="true"></UserQuizCard>
            </div>
        </div>
        <div class="row gx-1" v-if='quizzes.past.length > 0'>
            <h4>Past</h4>
            <div class="col-auto" v-for="quiz in quizzes.past">
                <UserQuizCard :quiz="quiz" :showHeader="true"></UserQuizCard>
            </div>
        </div>
    </div>
    `,
    components: {
        UserQuizCard
    },
    data() {
        return {
            quizzes: {
                upcoming: [],
                past: []
            }
        }
    },

    methods: {
        async fetchRecentQuizzes() {
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/get`;
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
                this.quizzes = data;
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
        }
    },

    mounted() {
        this.fetchRecentQuizzes();
    }

}