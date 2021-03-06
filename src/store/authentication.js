import Authentication from "@/controller/authentication";

const initState = {
  auth: false,
  info: {}
};

export const state = () => initState;

export const getters = {
  auth: state => state.auth,
  info: state => state.info
};

export const mutations = {
  setAuth: (state, payload) => (state.auth = payload),
  setInfo: (state, payload) => (state.info = payload)
};

export const actions = {
  async checkUser({ commit, state }) {
    try {
      if (!state.auth && _.isEmpty(state.info)) {
        return Promise.resolve();
      }
      if (!state.auth) {
        commit("setAuth", false);
        commit("setInfo", {});
        return Promise.reject(new Error("Silahkan login kembali"));
      }
      if (_.isEmpty(state.info)) {
        commit("setAuth", false);
        commit("setInfo", {});
        return Promise.reject(new Error("Silahkan login kembali"));
      }
      const karyawan = await Authentication.checkUser(state.info.id);
      if (_.isEmpty(karyawan)) {
        return Promise.reject(new Error("Silahkan login kembali"));
      }
      commit("setAuth", true);
      commit("setInfo", _.omit(karyawan.toJSON(), "password"));
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async login({ commit }, payload) {
    try {
      const karyawan = await Authentication.login(payload);
      commit("setAuth", true);
      commit("setInfo", _.omit(karyawan.toJSON(), "password"));
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async register(_store, payload) {
    try {
      await Authentication.register(payload);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async logout({ commit }) {
    commit("setAuth", false);
    commit("setInfo", {});
    return Promise.resolve();
  }
};
