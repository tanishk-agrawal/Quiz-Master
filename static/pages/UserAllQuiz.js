import UserQuizCard from "../components/UserQuizCard.js"

export default{
    template:`
    <div>
        <div class="row mt-4">
            <div class="col">
            <h3 class="fw-bold">Quizzes</h3>
            </div>
            <div class="col my-auto d-flex justify-content-end">
            <input type="text" id="search" placeholder=" 🔍︎ Search Quiz, Subject or Chapter" v-model="searchString" class="border-2 form-control" style="max-width:350px">
            </div>
        </div>
        <hr>
        <div class="row" v-if='loading' class="text-center alert alert-warning fw-bold m-4d-flex justify-content-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        </div>
        <div class="row" v-else-if='filteredUpcomingQuizzes.length == 0 && filteredPastQuizzes.length == 0' class="text-center alert alert-warning fw-bold m-4">No Quizzes Found</div>
        <div class="row gx-1" v-if='filteredUpcomingQuizzes.length > 0'>
            <h4>Live & Upcoming</h4>
            <div class="col-auto" v-for="quiz in filteredUpcomingQuizzes">
                <UserQuizCard :quiz="quiz" :showHeader="true"></UserQuizCard>
            </div>
        </div>
        <div class="row gx-1" v-if='filteredPastQuizzes.length > 0'>
            <h4>Past</h4>
            <div class="col-auto" v-for="quiz in filteredPastQuizzes">
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
            },

            searchString:"",
            loading:false
        }
    },
    computed: {
        filteredUpcomingQuizzes() {
            if(!this.searchString) {
                return this.quizzes.upcoming;
            }
            const q = this.searchString.trim().toLowerCase();

            return this.quizzes.upcoming.filter(item => {
                return (
                    item.name?.toLowerCase().includes(q) ||
                    item.subject.name?.toLowerCase().includes(q) ||
                    item.chapter.name?.toLowerCase().includes(q)
                );
            });
        },
        filteredPastQuizzes() {
            if(!this.searchString) {
                return this.quizzes.past;
            }
            const q = this.searchString.trim().toLowerCase();
            
            return this.quizzes.past.filter(item => {
                return (
                    item.name?.toLowerCase().includes(q) ||
                    item.subject.name?.toLowerCase().includes(q) ||
                    item.chapter.name?.toLowerCase().includes(q)
                );
            });
        },
    },

    methods: {
        async fetchRecentQuizzes() {
            this.loading = true;
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
            this.loading = false;
        }
    },

    mounted() {
        this.fetchRecentQuizzes();
    }

}