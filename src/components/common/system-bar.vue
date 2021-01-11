<template>
  <div class="system-bar">
    <div class="system-bar-title">
      Kos App
    </div>
    <b-button-group size="sm" class="ml-auto">
      <b-dropdown v-if="auth" variant="dark" size="sm" no-caret right>
        <template #button-content>
          <fa-layers class="fa-fw">
            <fa-icon :icon="['fa', 'user']" />
          </fa-layers>
        </template>
        <b-dropdown-item to="/setting">
          <fa-layers class="fa-fw">
            <fa-icon :icon="['fa', 'cog']" />
          </fa-layers>
          Setting
        </b-dropdown-item>
        <b-dropdown-item @click="logout">
          <fa-layers class="fa-fw">
            <fa-icon :icon="['fa', 'sign-out-alt']" />
          </fa-layers>
          Logout
        </b-dropdown-item>
      </b-dropdown>
      <b-button variant="dark" @click="win.minimize()">
        <fa-layers class="fa-fw">
          <fa-icon :icon="['far', 'window-minimize']" />
        </fa-layers>
      </b-button>
      <b-button variant="dark" @click="max ? win.restore() : win.maximize()">
        <fa-layers class="fa-fw">
          <fa-icon
            :icon="['far', max ? 'window-restore' : 'window-maximize']"
          />
        </fa-layers>
      </b-button>
      <b-button variant="dark" @click="win.close()">
        <fa-layers class="fa-fw">
          <fa-icon :icon="['fas', 'times']" />
        </fa-layers>
      </b-button>
    </b-button-group>
  </div>
</template>

<script>
import { remote } from "electron";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      max: false,
      win: null
    };
  },
  computed: {
    ...mapGetters("authentication", ["auth"])
  },
  mounted() {
    this.checkWindowEmpty();
    this.detectIsMax();
    this.win.on("maximize", this.isMaxTrue);
    this.win.on("unmaximize", this.isMaxFalse);
  },
  methods: {
    checkWindowEmpty() {
      if (this.win === null) {
        this.win = remote.getCurrentWindow();
      }
    },
    detectIsMax() {
      this.max = this.win.isMaximized();
    },
    isMaxTrue() {
      this.max = true;
    },
    isMaxFalse() {
      this.max = false;
    },
    async logout() {
      await this.$store.dispatchPromise("authentication/logout");
      this.$router.push("/login");
    }
  }
};
</script>
