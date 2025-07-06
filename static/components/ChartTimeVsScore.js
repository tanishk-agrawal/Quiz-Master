export default {
    template: `
    <div class="card shadow-sm p-3">
        <canvas id="bubbleChart"></canvas>
    </div>`,

    props : {

    },

    data(){
        return {
            chartData : {
                
            },
        }
    },

    methods : {
        async getChartData(){
            const origin = window.location.origin;
            const url = `${origin}/api/user-bubble-data`; 
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
                this.chartData = data;   
                console.log(this.chartData);             
                this.renderChart();
            } else {
                if (res.status === 401) {
                    localStorage.clear();
                    this.$router.push({ name: 'login', params:{error: "Session Expired : Please Login Again"}});
                } 
                const errorData = await res.json();
                console.error(errorData);
            }
        },

        renderChart() {   
            new Chart(document.getElementById('bubbleChart'), {
                type: 'bubble',
                data: {
                datasets: [{
                    label: 'User Quiz Attempts',
                    data: this.chartData,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
                },
                options: {
                responsive: true,
                plugins: {
                    title: {
                    display: true,
                    text: 'Quiz Scores vs Time Spent',
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                    },
                    legend: {
                    display: false
                    },
                    tooltip: {
                    callbacks: {
                        label: function(context) {
                        const d = context.raw;
                        return `Quiz: ${d.quiz}, Score: ${d.y}%, Time: ${d.x} min, #Ques: ${d.no_of_ques}`;
                        }
                    }
                    }
                },
                scales: {
                    x: {
                    title: { display: true, text: 'Time Taken (minutes)' }
                    },
                    y: {
                    title: { display: true, text: 'Score (%)' },
                    min: 0,
                    max: 100
                    }
                },
            responsive: true,
            maintainAspectRatio: false
            }
            });
        }
  
    },

    mounted(){
        this.getChartData();
    }

}