import UserQuizCard from "../components/UserQuizCard.js"

export default{
    template:`
    <div>
        <div class="row mt-4">
            <div class="col">
            <h3 class="fw-bold">Quizzes ({{quizzes.length}})</h3>
            </div>
        </div>
        <div class="row" v-if='quizzes.length == 0' class="text-center alert alert-warning fw-bold m-4">No Quizzes Found</div>
        <div class="row gx-1" v-else>
            <div class="col-auto" v-for="quiz in quizzes">
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
            quizzes: []
        }
    },

    methods: {
        async fetchRecentQuizzes() {
            const origin = window.location.origin;
            const url = `${origin}/api/quiz/recent`;
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
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
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