import { Kos, Kamar, Orang, Sequelize } from "@/framework/models";

const { Op } = Sequelize;

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
    const { page, perpage, ...query } = payload;
    const where = {};
    if (!_.isEmpty(query.nama)) {
      where.nama = { [Op.like]: `%${query.nama}%` };
    }
    if (!_.isEmpty(query.alamat)) {
      where.alamat = { [Op.like]: `%${query.alamat}%` };
    }
    if (!_.isEmpty(query.alamat)) {
      where.harga_default = { [Op.like]: `%${query.harga_default}%` };
    }
    try {
      const { count, rows } = await Kos.findAndCountAll({
        offset: (page - 1) * perpage,
        limit: perpage,
        where,
        include: [
          {
            model: Kamar
          },
          {
            model: Orang
          }
        ]
      });
      if (_.isEmpty(rows)) {
        return Promise.reject(new Error("Kos tidak ada"));
      }
      commit("setLists", rows);
      commit("setPagination", {
        page,
        perpage,
        total_page: Math.ceil(count / perpage),
        total_record: count
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
