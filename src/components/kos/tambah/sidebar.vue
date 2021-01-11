<template>
  <b-sidebar
    v-model="slide"
    title="Tambah Kos"
    right
    backdrop
    bg-variant="white"
    backdrop-variant="dark"
  >
    <template #header-close>
      <fa-layers class="fa-fw">
        <fa-icon :icon="['fas', 'times']" />
      </fa-layers>
    </template>
    <b-container fluid>
      <b-row>
        <b-col cols="12">a</b-col>
      </b-row>
    </b-container>
  </b-sidebar>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    slide: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
