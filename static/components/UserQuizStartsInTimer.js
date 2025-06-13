export default {
    template: `t
      <span class="fs-6 font-monospace px-2">
        {{formatTime(remainingTime)}}
      </span>
    `,
    props: {
        scheduledOn: {
          type: String,
          required: true,
        },
    },
    data() {
      return {
        timerInterval: null,
        remainingTime: null,
        isRunning: false,
        danger : false
      };
    },
    methods: {
        startTimer() {
            const scheduled_on = new Date(this.scheduledOn);
            const now = new Date();
            console.log(scheduled_on , now);
            this.isRunning = true;
            this.remainingTime = Math.floor((scheduled_on - now) / 1000);
            console.log(this.remainingTime);
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
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;

            const formattedHours = String(remainingHours).padStart(2, '0');
            const formattedMinutes = String(remainingMinutes).padStart(2, '0');
            const formattedSeconds = String(remainingSeconds).padStart(2, '0');
            if(days > 0) return `${days}d ${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
            if(hours > 0) return `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
            return `${formattedMinutes}m ${formattedSeconds}s`;
        },
        
    },
    mounted() {
      this.startTimer();      
    },
    beforeDestroy() {
      this.stopTimer();
    },
  };
  