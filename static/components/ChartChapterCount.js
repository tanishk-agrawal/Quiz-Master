export default {
    template: `
    <div class="card shadow-sm p-3">
        <canvas id="chapterCountChart"></canvas>
    </div>`,

    props : {
        

    },

    data(){
        return {
            chartData : {
                subjects : [],
            },
        }
    },

    methods : {
        async getChartData(){
            const origin = window.location.origin;
            const url = `${origin}/api/subject-chapter-counts`; 
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
        const labels = this.chartData.subjects.map(item => item.name);
        const counts = this.chartData.subjects.map(item => item.chapters);
        console.log(this.chartData, labels, counts);

        new Chart(document.getElementById('chapterCountChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Chapters',
                    data: counts,
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Subjects & Chapters Distribution',
                        font: {
                            size: 20,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: false
                    },
                },
            scales: {
                y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
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