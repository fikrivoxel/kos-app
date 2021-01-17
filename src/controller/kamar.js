import {
  Kos,
  Kamar,
  Orang,
  Op,
  transaction,
  sequelize
} from "@/framework/models";

export default {
  async getAll(data = {}) {
    const t = await transaction();
    const { page, perpage, ...query } = data;
    const where = [];
    if (!_.isEmpty(query.nama)) {
      where.push({ nama: { [Op.like]: `%${query.nama}%` } });
    }
    if (!_.isEmpty(query.harga)) {
      where.push(
        sequelize.where(
          sequelize.cast(sequelize.col("Kamar.harga"), "varchar"),
          {
            [Op.like]: `%${parseInt(query.harga)}%`
          }
        )
      );
    }
    if (!_.isEmpty(query.dihuni)) {
      where.push({ dihuni: { [Op.eq]: query.dihuni } });
    }
    try {
      const { count, rows } = await Kamar.findAndCountAll({
        offset: (page - 1) * perpage,
        limit: perpage,
        where: {
          [Op.and]: where
        },
        include: [
          {
            model: Kos
          },
          {
            model: Orang
          }
        ],
        transaction: t
      });
      if (_.isEmpty(rows)) {
        await t.rollback();
        return Promise.reject(new Error("Kamar tidak ada"));
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
      const kamar = await Kamar.findOne({
        where: {
          id: {
            [Op.eq]: id
          }
        },
        include: [
          {
            model: Kos
          },
          {
            model: Orang
          }
        ],
        transaction: t
      });
      if (_.isEmpty(kamar)) {
        await t.rollback();
        return Promise.reject(new Error("Kamar tidak ada"));
      }
      await t.commit();
      return kamar;
    } catch (err) {
      await t.rollback();
      return Promise.reject(err);
    }
  },
  async create(data) {
    const t = await transaction();
    try {
      const kamar = await Kamar.findOne({
        where: {
          nama: {
            [Op.eq]: data.nama
          }
        },
        transaction: t
      });
      if (!_.isEmpty(kamar)) {
        await t.rollback();
        return Promise.reject(new Error("Kamar sudah ada"));
      }
      await Kamar.create(data, { transaction: t });
      await t.commit();
      return Promise.resolve();
    } catch (err) {
      await t.rollback();
      return Promise.reject(err);
    }
  },
  async createBulk(datas) {
    const t = await transaction();
    const checkUniq = datas.filter((value, index, arr) => {
      if (arr.findIndex(s => s.name === value.name) !== index) {
        return true;
      } else {
        return false;
      }
    });
    if (!_.isEmpty(checkUniq)) {
      await t.rollback();
      return Promise.reject(new Error("Nama kamar tidak boleh sama"));
    }
    let errLoop = null;
    for (const data of datas) {
      try {
        const kamar = await Kamar.findOne({
          where: {
            nama: {
              [Op.eq]: data.nama
            }
          },
          transaction: t
        });
        if (!_.isEmpty(kamar)) {
          errLoop = new Error("Kamar sudah ada");
          break;
        }
      } catch (err) {
        errLoop = err;
        break;
      }
    }
    if (errLoop) {
      await t.rollback();
      return Promise.reject(errLoop);
    }
    try {
      await Kamar.bulkCreate(datas, {
        transaction: t
      });
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
      const kamar = await Kamar.findOne({
        where: {
          id: {
            [Op.eq]: id
          }
        },
        transaction: t
      });
      if (_.isEmpty(kamar)) {
        await t.rollback();
        return Promise.reject(new Error("Kamar tidak ada"));
      }
      if (kamar.nama !== updated.nama) {
        const checkNama = await Kamar.findOne({
          where: {
            nama: {
              [Op.eq]: updated.nama
            }
          },
          transaction: t
        });
        if (!_.isEmpty(checkNama)) {
          await t.rollback();
          return Promise.reject(new Error("Nama Kamar tidak boleh sama"));
        }
      }
      await Kamar.update(updated, {
        where: {
          id: {
            [Op.eq]: id
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
      await Kamar.destroy({
        where: {
          id: {
            [Op.eq]: id
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
