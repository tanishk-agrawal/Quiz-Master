export default {
    template: `
    <div class="card shadow-sm p-3">
        <canvas id="subjectPerformanceChart"></canvas>
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
            const url = `${origin}/api/user-subject-performance`; 
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
        const sorted = this.chartData.subjects.map((item, index) => ({ 
            label: item.name,
            percentage: item.average,
        })).sort((a, b) => b.percentage - a.percentage);

        const labels = sorted.map(item => item.label);
        const percentages = sorted.map(item => item.percentage);
        console.log(this.chartData, labels, percentages);

        const backgroundColors = percentages.map(percent => {
            if (percent < 30) return "#dc35458a";       // red
            else if (percent < 60) return "#ffc1078a";  // yellow
            else if (percent < 80) return "#bbdc358a";  // lime green
            else return "#1987548a";                    // green
        });

        new Chart(document.getElementById('subjectPerformanceChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Performance (%)',
                    data: percentages,
                    backgroundColor: backgroundColors,
                    borderColor: '#343a40',
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Subject-wise Performance (%)',
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
                yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 100
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Percentage (%)'
                }
                }],
                xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Subjects'
                }
                }]
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