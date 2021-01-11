import { Kos, Kamar, Orang, Op, transaction } from "@/framework/models";

export default {
  async getAll(data) {
    const t = await transaction();
    const { page, perpage, ...query } = data;
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
        ],
        transaction: t
      });
      if (_.isEmpty(rows)) {
        await t.rollback();
        return Promise.reject(new Error("Kos tidak ada"));
      }
      await t.commit();
      return {
        lists: rows.map(row => row.toJSON()),
        pagination: {
          page,
          perpage,
          total_page: Math.ceil(count / perpage),
          total_record: count
        }
      };
    } catch (err) {
      await t.rollback();
      return Promise.resolve(err);
    }
  },
  async getById(id) {
    const t = await transaction();
    try {
      const kos = await Kos.findOne({
        where: {
          id: {
            [Op.like]: id
          }
        },
        include: [
          {
            model: Kamar
          },
          {
            model: Orang
          }
        ],
        transaction: t
      });
      if (_.isEmpty(kos)) {
        await t.rollback();
        return Promise.reject(new Error("Kos tidak ada"));
      }
      await t.commit();
      return kos;
    } catch (err) {
      await t.rollback();
      return Promise.reject(err);
    }
  },
  async create(data) {
    const t = await transaction();
    try {
      const kos = await Kos.findOne({
        where: {
          nama: {
            [Op.like]: data.nama
          }
        },
        transaction: t
      });
      if (!_.isEmpty(kos)) {
        await t.rollback();
        return Promise.reject(new Error("Kos sudah ada"));
      }
      await Kos.create(data, { transaction: t });
      await t.commit();
      return Promise.resolve();
    } catch (err) {
      await t.rollback();
      return Promise.reject(err);
    }
  },
  async update(data) {
    const t = await transaction();
    const { id, ...updated } = data;
    try {
      const kos = await Kos.findOne({
        where: {
          id: {
            [Op.like]: id
          }
        },
        transaction: t
      });
      if (_.isEmpty(kos)) {
        await t.rollback();
        return Promise.reject(new Error("Kos tidak ada"));
      }
      if (kos.nama !== updated.nama) {
        const checkNama = await Kos.findOne({
          where: {
            nama: {
              [Op.like]: updated.nama
            }
          },
          transaction: t
        });
        if (!_.isEmpty(checkNama)) {
          await t.rollback();
          return Promise.reject(new Error("Nama Kos tidak boleh sama"));
        }
      }
      await Kos.update(updated, {
        where: {
          id: {
            [Op.like]: id
          }
        },
        transaction: t
      });
      await t.commit();
      return Promise.resolve();
    } catch (err) {
      await t.rollback();
      return Promise.reject(err);
    }
  },
  async destroy(id) {
    const t = await transaction();
    try {
      await Kos.destroy({
        where: {
          id: {
            [Op.like]: id
          }
        },
        transaction: t
      });
      await t.commit();
      return Promise.resolve();
    } catch (err) {
      await t.rollback();
      return Promise.reject(err);
    }
  }
};
