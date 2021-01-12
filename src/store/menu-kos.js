const initState = {
  open: false
};

export const state = () => initState;

export const getters = {
  open: state => state.open
};

export const mutations = {
  setOpen: (state, payload) => (state.open = payload)
};

export const actions = {
  setOpen: ({ commit }, payload) => commit("setOpen", payload)
};
