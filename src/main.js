import Vue from "vue";
import App from "./App.vue";
import { store, router } from "@/framework/renderer";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
