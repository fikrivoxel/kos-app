<template>
  <div class="system-bar">
    <div class="system-bar-panel">
      <div class="system-bar-title">
        Kos App
      </div>
      <b-button-group size="sm" class="ml-auto">
        <b-button v-if="buttonBars" variant="dark" @click="openMenuKos">
          <fa-layers class="fa-fw">
            <fa-icon :icon="['fas', 'bars']" />
          </fa-layers>
        </b-button>
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
    <loading />
  </div>
</template>

<script>
import { remote } from "electron";
import { mapGetters } from "vuex";
import Loading from "@/components/common/loading";
export default {
  components: {
    Loading
  },
  data() {
    return {
      max: false,
      win: null
    };
  },
  computed: {
    ...mapGetters("authentication", ["auth"]),
    ...mapGetters("kos", {
      kos: "selected"
    }),
    ...mapGetters("menu-kos", ["open"]),
    buttonBars() {
      if (
        this.$route.name &&
        this.$route.name.includes("kos-id") &&
        !_.isEmpty(this.kos)
      ) {
        return true;
      }
      return false;
    }
  },
  watch: {
    $route: {
      deep: true,
      handler() {
        if (
          this.$route.name &&
          this.$route.name.includes("kos-id") &&
          !_.isEmpty(this.kos)
        ) {
          const titlebar = this.$route.meta?.titlebar;
          if (!_.isEmpty(titlebar)) {
            this.setTitleBar(titlebar);
          } else {
            this.setTitleBar();
          }
        }
      }
    }
  },
  mounted() {
    this.checkWindowEmpty();
    this.detectIsMax();
    this.win.on("maximize", this.isMaxTrue);
    this.win.on("unmaximize", this.isMaxFalse);
  },
  methods: {
    setTitleBar(titlebar = {}) {
      const { title = "", breadcrumbs = [] } = titlebar;
      this.$store.dispatch("title-bar/setTitle", title);
      this.$store.dispatch("title-bar/setBreadcrumbs", breadcrumbs);
    },
    openMenuKos() {
      this.$store.dispatch("menu-kos/setOpen", !this.open);
    },
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
