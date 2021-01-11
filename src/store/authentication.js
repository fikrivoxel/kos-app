import bcrypt from "bcryptjs";
import { Karyawan, Sequelize } from "@/framework/models";

const { Op } = Sequelize;

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
      const karyawan = await Karyawan.findOne({
        where: {
          id: {
            [Op.eq]: state.info.id
          }
        }
      });
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
      const karyawan = await Karyawan.findOne({
        where: {
          username: {
            [Op.eq]: payload.username
          }
        }
      });
      if (_.isEmpty(karyawan)) {
        return Promise.reject(new Error("Username tidak ada"));
      }
      const checkPass = await bcrypt.compare(
        payload.password,
        karyawan.password
      );
      if (!checkPass) {
        return Promise.reject(new Error("Password anda salah"));
      }
      commit("setAuth", true);
      commit("setInfo", _.omit(karyawan.toJSON(), "password"));
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async register(_store, payload) {
    try {
      const karyawan = await Karyawan.findOne({
        where: {
          username: {
            [Op.eq]: payload.username
          }
        }
      });
      if (!_.isEmpty(karyawan)) {
        return Promise.reject(new Error("Username sudah ada"));
      }
      const hashPass = await bcrypt.hash(payload.password, 10);
      await Karyawan.create({
        username: payload.username,
        password: hashPass,
        nama_awal: payload.nama_awal,
        nama_akhir: payload.nama_akhir
      });
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
