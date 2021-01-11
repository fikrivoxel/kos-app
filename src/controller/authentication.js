import bcrypt from "bcryptjs";
import { Karyawan, Op, transaction } from "@/framework/models";

export default {
  async checkUser(id) {
    const t = await transaction();
    try {
      const karyawan = await Karyawan.findOne({
        where: {
          id: {
            [Op.eq]: id
          }
        },
        transaction: t
      });
      await t.commit();
      return karyawan;
    } catch (err) {
      await t.rollback();
      return Promise.reject(err);
    }
  },
  async login(data) {
    const t = await transaction();
    try {
      const karyawan = await Karyawan.findOne({
        where: {
          username: {
            [Op.eq]: data.username
          }
        },
        transaction: t
      });
      if (_.isEmpty(karyawan)) {
        await t.rollback();
        return Promise.reject(new Error("Username tidak ada"));
      }
      const checkPass = await bcrypt.compare(data.password, karyawan.password);
      if (!checkPass) {
        await t.rollback();
        return Promise.reject(new Error("Password anda salah"));
      }
      await t.commit();
      return karyawan;
    } catch (err) {
      await t.rollback();
      return Promise.reject(err);
    }
  },
  async register(data) {
    const t = await transaction();
    try {
      const karyawan = await Karyawan.findOne({
        where: {
          username: {
            [Op.eq]: data.username
          }
        },
        transaction: t
      });
      if (!_.isEmpty(karyawan)) {
        await t.rollback();
        return Promise.reject(new Error("Username sudah ada"));
      }
      const hashPass = await bcrypt.hash(data.password, 10);
      await Karyawan.create(
        {
          username: data.username,
          password: hashPass,
          nama_awal: data.nama_awal,
          nama_akhir: data.nama_akhir
        },
        { transaction: t }
      );
      await t.commit();
      return Promise.resolve();
    } catch (err) {
      await t.rollback();
      return Promise.reject(err);
    }
  }
};
