const initState = {
  title: "",
  breadcrumbs: []
};

export const state = () => initState;

export const getters = {
  title: state => state.title,
  breadcrumbs: state => state.breadcrumbs
};

export const mutations = {
  setTitle: (state, payload) => (state.title = payload),
  setBreadcrumbs: (state, payload) => (state.breadcrumbs = payload)
};

export const actions = {
  setTitle: ({ commit }, payload) => commit("setTitle", payload),
  setBreadcrumbs: ({ commit }, payload) => commit("setBreadcrumbs", payload)
};
