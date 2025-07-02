import UserQuizCard from "../components/UserQuizCard.js"

export default{
    template:`
    <div>
        <div class="row mt-4">
            <div class="col">
                <h3 class="fw-bold">{{subject.name}}</h3>
            </div>
            <div class="col-auto my-auto text-end fw-bold">
                <a href="#"  class="dropdown link-dark" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-list-task h3"></i></a>
                <ul class="dropdown-menu">
                    <li><h4 class="dropdown-header" style="font-size: 1rem;">Index</h4></li>
                    <li v-for="chapter in subject.chapters">
                        <a class="dropdown-item" :href="'/#chapter' + chapter.id">
                            <div class="fw-bold">{{chapter.name}}</div> 
                            <div class="text-muted" style="font-size: 0.8rem;">{{chapter.number_of_quizzes}} Quizzes</div>
                        </a>                        
                    </li>
                </ul>
            </div>
        </div>
        <hr>

        <div v-for="chapter in subject.chapters">
            <div class="card shadow-sm m-4" :id="'chapter' + chapter.id">
            <div class="card-body ">
                <button class="btn px-5 w-100" type="button" @click="toggleAndFetch(chapter.id)" data-bs-toggle="collapse" :href="'#chQuiz' + chapter.id">
                <div class="row text-start">
                    <div class="col my-auto">
                        <div class="row fw-bold ">
                            <span class="fs-4">{{chapter.name}}</span>
                            <span class="fs-6 mb-2 text-body-secondary">{{chapter.number_of_quizzes}} Quizzes</span>
                        </div>
                        <div class="row text-muted fs-6" style="max-height: 45px; overflow-y: hidden;">
                            <small>{{chapter.description}}</small>
                        </div>
                    </div>
                    
                    <div class="col-auto my-auto">
                    <i class="bi bi-caret-down-fill"></i>
                    </div>
                </div>    
                </button>
                <div class="collapse card text-bg-warning bg-opacity-25 " :id="'chQuiz' + chapter.id">
                    <div v-if="chapter.number_of_quizzes == 0"><div class="text-muted fw-bold text-center">No Quizzes</div></div>
                    <div v-else>
                    <div class="d-flex flex-wrap">
                        <span v-for="quiz in chapterQuizzes[chapter.id]">
                            <UserQuizCard :quiz="quiz"></UserQuizCard>
                        </span>
                    </div>
                    </div>
                </div>    
            </div>
            </div>
        </div>
    </div>`,
    data(){
        return{
            subject : {},
            chapterQuizzes : {},
        }
    },
    components: {
        UserQuizCard,
    },
    methods: {
        async fetchSubject(){
            const origin = window.location.origin;
            const url = `${origin}/api/subject/${this.$route.params.id}/chapters`;
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
                this.subject = data;
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } else if (res.status === 404) {
                    this.subject = {};
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        async fetchChapterQuizzes(id){
            const origin = window.location.origin;
            const url = `${origin}/api/chapter/${id}/quiz/user`;
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
                let temp = { ...this.chapterQuizzes};       /// Using 'deep cloning' method to retain previous data
                temp[id] = data.quizzes;                    /// As direct changes in the object did not render in the template
                this.chapterQuizzes = temp;                 /// And its only rendered when the whole object is changed
                console.log(this.chapterQuizzes);
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } else if (res.status === 404) {
                    this.chapterQuizzes[id] = [];
                }
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        toggleAndFetch(id){
            const myCollapsible = document.getElementById('chQuiz' + id);
            myCollapsible.addEventListener('shown.bs.collapse', event => {
                this.fetchChapterQuizzes(id);
            });
        }
    },
    mounted(){
        this.fetchSubject();
    }
}