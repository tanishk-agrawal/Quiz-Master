import ChartChapterCount from "../components/ChartChapterCount.js";
import ChartQuizTime from "../components/ChartQuizTime.js";

export default {
    template: `
    <div>
       <div class="row my-3 font-monospace fw-bold">
            <div class="col card shadow-sm p-3 me-2">
                <div>
                    <span class="fs-3"> {{count.users}}</span>
                    <span class=""> Users</span>
                </div>
            </div>
            <div class="col card shadow-sm p-3 mx-2">
                <div>
                    <span class="fs-3">{{count.subjects}}</span>
                    <span class="">Subjects</span>
                </div>
            </div>
            <div class="col card shadow-sm p-3 mx-2">
                <div>
                    <span class="fs-3">{{count.chapters}}</span>
                    <span class="">Chapters</span>
                </div>
            </div>
            <div class="col card shadow-sm p-3 ms-2">
                <div>
                    <span class="fs-3">{{count.quizzes}}</span>
                    <span class="">Quizzes</span>
                </div>
            </div>
        </div>
        <div class="row my-3">
            <ChartChapterCount class="col me-2" style="height: 400px"/>            
            <ChartQuizTime class="col ms-2"/>
        </div>
    </div>`,
    data() {
        return {
            count : {},
        }
    },
    components: {
        ChartChapterCount,
        ChartQuizTime
    },

    methods: {
        async fetchCount() {
            const origin = window.location.origin;
            const url = `${origin}/api/counts`;
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
                this.count = data;
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } 
                const errorData = await res.json();
                console.error(errorData);
            }          
        }   
    },

    mounted() {
        this.fetchCount();
    }
}