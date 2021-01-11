import Vue from "vue";
import Vuex from "vuex";
import { createSharedMutations } from "vuex-electron";
import promiseActions from "@/framework/package/store/plugins/promise-actions";

Vue.use(Vuex);

const modules = () => {
  const files = require.context("../../../store", false, /\.js$/);
  const mdls = {};
  files.keys().forEach(key => {
    const filesKey = _.has(files(key), "default")
      ? files(key).default
      : files(key);
    mdls[key.replace(/(\.\/|\.js)/g, "")] = {
      namespaced: true,
      ...filesKey
    };
  });
  return mdls;
};

export default new Vuex.Store({
  modules: modules(),
  plugins: [createSharedMutations(), promiseActions()],
  strict: process.env.NODE_ENV !== "production"
});
