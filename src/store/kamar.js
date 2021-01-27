import Kamar from "@/controller/kamar";

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
      const { lists, pagination } = await Kamar.getAll(payload);
      commit("setLists", lists);
      commit("setPagination", pagination);
      return Promise.resolve();
    } catch (err) {
      if (err.message === "Kamar tidak ada") {
        commit("setLists", []);
        commit("setPagination", {});
      }
      return Promise.reject(err);
    }
  },
  async getById({ commit }, payload) {
    try {
      const kamar = await Kamar.getById(payload.id);
      commit("setSelected", kamar.toJSON());
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve(err);
    }
  },
  async create(_store, payload) {
    try {
      await Kamar.create(payload);
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve(err);
    }
  },
  async createBulk(_store, payload) {
    try {
      await Kamar.createBulk(payload);
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve(err);
    }
  },
  async update(_store, payload) {
    try {
      await Kamar.update(payload);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async destroy(_store, payload) {
    try {
      await Kamar.destroy(payload.id);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
