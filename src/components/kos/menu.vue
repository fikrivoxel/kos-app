<template>
  <b-sidebar
    v-model="slide"
    title="Menu"
    backdrop
    bg-variant="white"
    backdrop-variant="dark"
  >
    <template #header-close>
      <fa-layers class="fa-fw">
        <fa-icon :icon="['fas', 'times']" />
      </fa-layers>
    </template>
    <template #footer>
      <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
        {{ kos.nama }}
        <b-button size="sm" class="ml-auto" to="/">
          Kembali Ke Kos
        </b-button>
      </div>
    </template>
    <b-list-group flush>
      <b-list-group-item :to="toLink('kamar')" @click="toLinkClose">
        Kamar
      </b-list-group-item>
      <b-list-group-item :to="toLink('kamar')" @click="toLinkClose">
        Orang
      </b-list-group-item>
      <b-list-group-item :to="toLink('setting')" @click="toLinkClose">
        Setting
      </b-list-group-item>
    </b-list-group>
  </b-sidebar>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("menu-kos", ["open"]),
    ...mapGetters("kos", {
      kos: "selected"
    }),
    slide: {
      get() {
        return this.open;
      },
      set(val) {
        this.$store.dispatch("menu-kos/setOpen", val);
      }
    }
  },
  beforeDestroy() {
    if (this.slide) {
      this.slide = false;
    }
  },
  methods: {
    toLink(link) {
      const id = this.$route.params?.id;
      return `/kos/${id}/${link}`;
    },
    toLinkClose() {
      if (this.slide) {
        this.slide = false;
      }
    }
  }
};
</script>
