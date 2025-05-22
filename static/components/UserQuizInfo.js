export default{
    template:`
    <div class="card p-2">
        <div class="row d-flex justify-content-center" style="max-width: 800px">
            <div class="col-auto my-auto">
            <table class="table table-sm w-auto">
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
                    <th>Deadline </th>
                    <td> : </td>
                    <td><span v-if="!quiz.deadline">None</span>{{quiz.deadline_formatted}} </td>
                </tr>
                
            </tbody>
            </table>
            </div>
            <div class="vr p-0 mx-2"></div>
            <div class="col" v-if='quiz.instructions' ><b>Instructions</b><br><div style="white-space: pre-wrap; max-height: 200px; overflow-y: scroll">{{quiz.instructions}}</div></div><br>
        </div>
    </div>
    `,
    props: {
        quiz: {
          type: Object,
          required: true,
        }
    },
}