export default {
    
    template: `
    <div>
    <div class="card shadow-sm m-2" style="min-width: 200px;">
        <div class="card-header" v-if="showHeader">
            <span class="badge text-bg-warning bg-opacity-100">{{quiz.subject.name}}</span> > 
            <span class="badge text-bg-warning bg-opacity-100">{{quiz.chapter.name}}</span>
        </div>
        <div class="card-body">
            
            <router-link :to="'/quiz/' + quiz.id" class="stretched-link link-dark link-underline-opacity-0">
            <div class="d-flex justify-content-between mb-2">
                <span class="h4 card-title text-warning-emphasis ">{{quiz.name}} </span>
                <span v-if="is_live()" class="badge text-danger border border-2 border-danger my-auto font-monospace fw-bold">⏺ LIVE</span>
            </div>
            </router-link> 
            <div>
                <small class="fw-bold">
                <div class="d-flex justify-content-between mb-1">
                    <span>{{quiz.number_of_questions}} MCQs</span>
                    <span class="text-end"><i class="bi bi-clock-history"></i> {{quiz.time_limit_formatted}} </span>
                </div>
                <div class="text-muted">
                    <div v-if="quiz.result.attempted">Result : <span :style="progressStyle(quiz.result.percentage)"> {{quiz.result.percentage}}% </span></div>
                    <div v-else-if="is_quiz_ended()">Result : Not Attempted</div>
                    <span v-else><i class="bi bi-calendar-week"></i>&nbsp;<span> {{quiz.scheduled_on_formatted}} </span></span>

                </div>
                </small>
            </div>
            
        </div>
    </div>
    </div>
    `,
    props: {
        quiz: {
          type: Object,
          required: true,
        },
        showHeader: {
            type: Boolean,
            required: false
        }
    },
    
    methods: {
        is_quiz_ended() {
            const scheduled_on = new Date(this.quiz.scheduled_on);
            const ends_on = new Date(scheduled_on.getTime() + (this.quiz.time_limit * 60 * 1000));
            return ends_on < new Date();
        },

        is_live(){
            const scheduled_on = new Date(this.quiz.scheduled_on);
            const ends_on = new Date(scheduled_on.getTime() + (this.quiz.time_limit * 60 * 1000));
            const now = new Date();
            return scheduled_on <= now && now <= ends_on;
        },
        progressStyle(percent) {
            let color = "#198754";
            if (percent < 30){color = "#dc3545";}
            else if (percent < 60){color = "#ffc107";}
            else if (percent < 80){color = "#bbdc35";}

            return {
                color: color,
                width: percent + '%'
            };
        }
    },
    mounted() {
        console.log(this.quiz);
    }
}