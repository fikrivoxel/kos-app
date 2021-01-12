<template>
  <div>
    <b-progress
      v-if="show"
      :value="percent"
      max="100"
      :variant="canSuccess ? 'info' : 'danger'"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      percent: 0,
      reversed: false,
      skipTimerCount: 0,
      throttle: 200,
      duration: 3000,
      continuous: true
    };
  },
  computed: {
    ...mapGetters("loading", ["show", "canSuccess", "start"])
  },
  watch: {
    start() {
      if (this.start) {
        this.starting();
      } else {
        this.finish();
      }
    }
  },
  beforeDestroy() {
    this.clear();
  },
  methods: {
    clear() {
      clearInterval(this._timer);
      clearTimeout(this._throttle);
      this._timer = null;
    },
    starting() {
      this.clear();
      this.percent = 0;
      this.reversed = false;
      this.skipTimerCount = 0;
      this.$store.dispatch("loading/setCanSuccess", true);
      if (this.throttle) {
        this._throttle = setTimeout(() => this.startTimer(), this.throttle);
      } else {
        this.startTimer();
      }
      return this;
    },
    set(num) {
      this.$store.dispatch("loading/setShow", true);
      this.$store.dispatch("loading/setCanSuccess", true);
      this.percent = Math.min(100, Math.max(0, Math.floor(num)));
      return this;
    },
    get() {
      return this.percent;
    },
    increase(num) {
      this.percent = Math.min(100, Math.floor(this.percent + num));
      return this;
    },
    decrease(num) {
      this.percent = Math.max(0, Math.floor(this.percent - num));
      return this;
    },
    pause() {
      clearInterval(this._timer);
      return this;
    },
    resume() {
      this.startTimer();
      return this;
    },
    finish() {
      this.percent = this.reversed ? 0 : 100;
      this.hide();
      return this;
    },
    hide() {
      this.clear();
      setTimeout(() => {
        this.$store.dispatch("loading/setShow", false);
        this.$nextTick(() => {
          this.percent = 0;
          this.reversed = false;
        });
      }, 500);
      return this;
    },
    startTimer() {
      if (!this.show) {
        this.$store.dispatch("loading/setShow", true);
      }
      if (typeof this._cut === "undefined") {
        this._cut = 10000 / Math.floor(this.duration);
      }
      this._timer = setInterval(() => {
        if (this.skipTimerCount > 0) {
          this.skipTimerCount--;
          return;
        }
        if (this.reversed) {
          this.decrease(this._cut);
        } else {
          this.increase(this._cut);
        }
        if (this.continuous) {
          if (this.percent >= 100) {
            this.skipTimerCount = 1;
            this.reversed = !this.reversed;
          } else if (this.percent <= 0) {
            this.skipTimerCount = 1;
            this.reversed = !this.reversed;
          }
        }
      }, 100);
    }
  }
};
</script>
