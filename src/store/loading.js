const initState = {
  show: false,
  canSuccess: true,
  start: false
};

export const state = () => initState;

export const getters = {
  show: state => state.show,
  canSuccess: state => state.canSuccess,
  start: state => state.start
};

export const mutations = {
  setShow: (state, payload) => (state.show = payload),
  setCanSuccess: (state, payload) => (state.canSuccess = payload),
  setStart: (state, payload) => (state.start = payload)
};

export const actions = {
  setShow: ({ commit }, payload) => commit("setShow", payload),
  setCanSuccess: ({ commit }, payload) => commit("setCanSuccess", payload),
  start: ({ commit }) => commit("setStart", true),
  fail: ({ commit }) => commit("setCanSuccess", false),
  finish: ({ commit }) => commit("setStart", false)
};
