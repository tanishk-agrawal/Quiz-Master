export default{
    template:`
    <div class="card p-2">
        <small class="row d-flex justify-content-center" style="max-width: 800px">
            <div class="col-auto my-auto">
            <div class="mb-2">                
                <span class="badge text-bg-warning bg-opacity-100 me-1">{{quiz.subject.name}}</span><i class="bi bi-caret-right-fill"></i>
                <span class="badge text-bg-warning bg-opacity-100 mx-1">{{quiz.chapter.name}}</span>
            </div>
            <table class="table table-sm w-auto m-0">
            <tbody class="">
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
                    <th>Scheduled On </th>
                    <td> : </td>
                    <td>{{quiz.scheduled_on_formatted}} </td>
                </tr>
                
            </tbody>
            </table>
            </div>
            <div class="vr p-0 mx-2"></div>
            <div class="col" v-if='quiz.instructions' ><b>Instructions</b><br><div style="white-space: pre-wrap; max-height: 200px; overflow-y: scroll">{{quiz.instructions}}</div></div><br>
        </small>
    </div>
    `,
    props: {
        quiz: {
          type: Object,
          required: true,
        }
    },
}