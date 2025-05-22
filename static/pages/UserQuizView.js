export default{
    template:`
    <div class="row my-5 py-4">
        <div class="col d-flex justify-content-center align-items-center">
            <div class="card shadow-sm p-5" >
                <div class="mb-2">                
                <span class="badge text-bg-warning bg-opacity-100 me-1">{{quiz.subject.name}}</span><i class="bi bi-caret-right-fill"></i>
                <span class="badge text-bg-warning bg-opacity-100 mx-1">{{quiz.chapter.name}}</span>
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
                            <th>Deadline </th>
                            <td> : </td>
                            <td><span v-if="!quiz.deadline">None</span>{{quiz.deadline_formatted}} </td>
                        </tr>
                        
                    </tbody>
                    </table>
                    </div>
                    <div class="vr p-0 mx-2"></div>
                    <div class="col" v-if='quiz.instructions' ><b>Instructions</b><br><div style="white-space: pre-wrap; max-height: 220px; overflow-y: scroll">{{quiz.instructions}}</div></div><br>
                </div>
                <div class="d-flex justify-content-center">
                    <router-link :to="'/quiz/' + quiz.id + '/attempt'" class="btn btn-success fw-bold w-50">Start Quiz</router-link>
                </div>
            </div>
        </div>
    </div>`,
    data(){
        return{
            quiz:{}
        }
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
                this.checkAttempted();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    alert("Session Expired : Please Login Again");
                    this.$router.push("/");
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
        }
    },
    mounted(){
        this.fetchQuiz()
    }
}