import Kos from "@/controller/kos";

const initState = {
  selected: {},
  lists: [],
  pagination: {}
};

export const state = () => initState;

export const getters = {
  selected: state => state.selected,
  lists: state => state.lists,
  pagination: state => state.pagination
};

export const mutations = {
  setSelected: (state, payload) => (state.selected = payload),
  setLists: (state, payload) => (state.lists = payload),
  setPagination: (state, payload) => (state.pagination = payload)
};

export const actions = {
  async getAll({ commit }, payload) {
    try {
      const { lists, pagination } = await Kos.getAll(payload);
      commit("setLists", lists);
      commit("setPagination", pagination);
      return Promise.resolve();
    } catch (err) {
      if (err.message === "Kos tidak ada") {
        commit("setLists", []);
        commit("setPagination", {});
      }
      return Promise.reject(err);
    }
  },
  async getById({ commit }, payload) {
    try {
      const kos = await Kos.getById(payload.id);
      commit("setSelected", kos.toJSON());
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve(err);
    }
  },
  async create(_store, payload) {
    try {
      await Kos.create(payload);
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve(err);
    }
  },
  async update(_store, payload) {
    try {
      await Kos.update(payload);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async destroy(_store, payload) {
    try {
      await Kos.destroy(payload.id);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
