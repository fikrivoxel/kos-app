import Vue from "vue";
import VueRouter from "vue-router";
import routes from "vue-auto-routing";
import { createRouterLayout } from "vue-router-layout";
import Middlelware from "@/framework/package/router/plugins/middleware";

Vue.use(VueRouter);

const RouterLayout = createRouterLayout(layout => {
  return import("@/layouts/" + layout + ".vue");
});

export default store => {
  const Router = new VueRouter({
    routes: [
      {
        path: "/",
        component: RouterLayout,
        children: routes
      }
    ]
  });
  Router.beforeEach(Middlelware(store));
  return Router;
};
