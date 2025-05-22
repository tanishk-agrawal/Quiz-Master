export default {
    
    template: `
    <div>
    <div class="card shadow-sm m-2 text-bg-warning bg-opacity-50 border-secondary" style="width: 15rem">
        <div class="card-body">
            <router-link :to="'/subject/' + subject.id" class="link-dark link-underline-opacity-0">
                <h4 class="card-title ">{{subject.name}} </h4>
            </router-link> 
            <div>
                <small class="fw-medium text-warning-emphasis">
                <div class="d-flex justify-content-between fw-bold">
                    <span>{{subject.number_of_chapters}} Chapters</span>
                    <span class="text-end" data-bs-toggle="collapse" :data-bs-target="'#details' + subject.id" aria-expanded="false" aria-controls="details" style="cursor: pointer;"><i class="bi bi-caret-down-fill"></i></span>
                </div>
                <div class="mt-2 collapse fw-normal text-muted" :id="'details' + subject.id" style="max-height: 100px; overflow-y: hidden;">{{subject.description}}</div>             
                </small>
            </div>            
        </div>
    </div>
    </div>
    `,
    props: {
        subject: {
          type: Object,
          required: true,
        },
    }
}