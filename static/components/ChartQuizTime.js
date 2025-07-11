export default {
    template: `
    <div class="card shadow-sm p-3">
        <canvas id="quizTimeChart"></canvas>
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
            const url = `${origin}/api/quiz-time-distribution`; 
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
        const labels = Object.keys(this.chartData);
        const values = Object.values(this.chartData).map(arr => ({
            min: Math.min(...arr),
            max: Math.max(...arr),
            mean: this.mean(arr),
            median: this.median(arr),
            q1: this.quantile(arr, 0.25),
            q3: this.quantile(arr, 0.75),
        }));

        new Chart(document.getElementById('quizTimeChart'), {
            type: 'boxplot',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Time Spent (minutes)',
                    data: values,
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Time Distribution per Quiz ',
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
                        return [`Time Spent (minutes):`, 
                            `Min: ${d.min}, Max: ${d.max}, Mean: ${d.mean}`, 
                            `Q1: ${d.q1}, Median: ${d.median}, Q3: ${d.q3}`];
                        }
                    }
                    }
                },
            responsive: true,
            maintainAspectRatio: false
            }
        });
        },
        
        mean(arr) {
            return arr.reduce((a, b) => a + b, 0) / arr.length;
        },
        median(arr) {
            const sorted = [...arr].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 === 0
                ? (sorted[mid - 1] + sorted[mid]) / 2
                : sorted[mid];
        },
        quantile(arr, q) {
            const sorted = [...arr].sort((a, b) => a - b);
            const pos = (sorted.length - 1) * q;
            const base = Math.floor(pos);
            const rest = pos - base;
            if (sorted[base + 1] !== undefined) {
                return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
            }
            return sorted[base];
        }
    },

    

    mounted(){
        this.getChartData();
    }

}