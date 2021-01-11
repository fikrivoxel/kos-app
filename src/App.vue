<template>
  <div id="app" class="app">
    <system-bar />
    <router-view />
  </div>
</template>

<script>
import SystemBar from "@/components/common/system-bar";
export default {
  components: {
    SystemBar
  }
};
</script>
