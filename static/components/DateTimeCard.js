export default {
    template: `
      <div>
        <div class="card shadow-sm" style="height: 60px;">
        <div class="card-body font-monospace fs-5 fw-bold">
          <span class="m-0 text-warning-emphasis">{{ date }}</span>  
          <span class="m-0 text-success-emphasis"> {{ time }}</span>
        </div>
        </div>
      </div>
    `,
    data() {
      return {
        date: this.getCurrentDate(),
        time: this.getCurrentTime(),
      };
    },
    methods: {
      getCurrentDate() {
        return new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          weekday: "short",
        });
      },
      getCurrentTime() {
        return new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
      updateClock() {
        this.time = this.getCurrentTime();
        this.date = this.getCurrentDate();
      },
    },
    mounted() {
      this.timer = setInterval(this.updateClock, 10000);
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
  };
  