<template>
  <div>
    <b-link :to="toHome()">a</b-link>
  </div>
</template>

<script>
export default {
  methods: {
    toHome() {
      const id = this.$route?.params?.id;
      return `/kos/${id}/home`;
    }
  }
};
</script>
