<template>
  <fragment>
    <template v-if="!container">
      <h1 class="mt-4">
        {{ tl || "" }}
      </h1>
      <b-breadcrumb :items="br || []" />
    </template>
    <template v-else>
      <b-col cols="12">
        <h1 class="mt-4">
          {{ tl || "" }}
        </h1>
        <b-breadcrumb :items="br || []" />
      </b-col>
    </template>
  </fragment>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    title: {
      type: String,
      default: null
    },
    breadcrumbs: {
      type: Array,
      default() {
        return [];
      }
    },
    container: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters("title-bar", {
      tl: "title",
      br: "breadcrumbs"
    })
  },
  mounted() {
    this.setProps();
  },
  methods: {
    setProps() {
      if (!_.isEmpty(this.title)) {
        this.$store.dispatch("title-bar/setTitle", this.title);
      }
      if (!_.isEmpty(this.breadcrumbs) && _.isArray(this.breadcrumbs)) {
        this.$store.dispatch("title-bar/setBreadcrumbs", this.breadcrumbs);
      }
    }
  }
};
</script>
