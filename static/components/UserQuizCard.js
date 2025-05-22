export default {
    
    template: `
    <div>
    <div class="card shadow-sm m-2" style="min-width: 14rem;">
        <div class="card-header" v-if="showHeader">
            <span class="badge text-bg-warning bg-opacity-100">{{quiz.subject.name}}</span> > 
            <span class="badge text-bg-warning bg-opacity-100">{{quiz.chapter.name}}</span>
        </div>
        <div class="card-body">
            <router-link :to="'/quiz/' + quiz.id" class="stretched-link link-dark link-underline-opacity-0">
                <h4 class="card-title text-warning-emphasis ">{{quiz.name}} </h4>
            </router-link> 
            <div>
                <small class="fw-medium">
                <div class="d-flex justify-content-between fw-bold mb-1">
                    <span>{{quiz.number_of_questions}} MCQs</span>
                    <span class="text-end"><i class="bi bi-clock-history"></i> {{quiz.time_limit_formatted}} </span>
                </div>
                <div v-if="quiz.deadline_formatted" class="text-muted">
                    <span :class="is_deadline_passed(quiz.deadline) ? 'text-danger' : 'text-info-emphasis'">Deadline : <span> {{quiz.deadline_formatted}} </span></span>
                </div>
                <div v-else class="text-muted ">No deadline</div>
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
        is_deadline_passed(deadline) {
            return new Date(deadline) < new Date();
        }
    },
    mounted() {
    }
}