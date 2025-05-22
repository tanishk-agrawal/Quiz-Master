export default {
    template: `
      <div>
        <div class=card shadow-sm>
            <div class="card-body p-0 px-4 font-monospace rounded-2" :class="danger ? 'text-danger bg-danger-subtle border border-danger' : ''">
            <span class="fw-bold mx-1">Time Left</span>
            <span class="fw-bold fs-4 mx-1">{{formatTime(remainingTime)}}</span>
            </div>                        
        </div>
      </div>
    `,
    props: {
        totalTime: {
          type: Number,
          required: true,
        },
    },
    data() {
      return {
        timerInterval: null,
        remainingTime: 60,
        isRunning: false,
        danger : false
      };
    },
    methods: {
        startTimer() {
            this.isRunning = true;
            this.remainingTime = this.totalTime;
            this.timerInterval = setInterval(() => {
                if (this.remainingTime > 0) {
                    this.remainingTime--;
                    localStorage.setItem("timelimit", this.remainingTime);
                    if (this.remainingTime <= 30) {
                        this.danger = true;
                    }
                } else {
                    this.stopTimer();
                    this.$emit('time-up');
                }
            }, 1000);
        },
        stopTimer() {
            clearInterval(this.timerInterval);
            this.isRunning = false;
        },
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;

            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(remainingMinutes).padStart(2, '0');
            const formattedSeconds = String(remainingSeconds).padStart(2, '0');
            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        },
        
    },
    mounted() {
      this.startTimer();      
    },
    beforeDestroy() {
      this.stopTimer();
    },
  };
  