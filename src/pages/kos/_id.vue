<template>
  <b-container fluid>
    <b-row>
      <title-bar title="Dashboard" container />
    </b-row>
    <router-view />
    <kos-menu />
  </b-container>
</template>

<route>
{
  "meta": {
    "middleware": ["kos", "title-bar"]
  }
}
</route>

<script>
import KosMenu from "@/components/kos/menu";
import TitleBar from "@/components/common/title-bar.vue";
export default {
  components: {
    KosMenu,
    TitleBar
  }
};
</script>
