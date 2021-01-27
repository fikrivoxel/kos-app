import {
  Kos,
  Kamar,
  Orang,
  DataDiri,
  Op,
  transaction,
  sequelize
} from "@/framework/models";

export default {
  async getAll(data = {}) {
    const t = await transaction();
    const { page, perpage, ...query } = data;
    const include = [
      {
        model: Kos,
        as: "Kos"
      },
      {
        model: Kamar,
        as: "Kamar"
      },
      {
        model: DataDiri,
        as: "DataDiri"
      }
    ];
    const where_orang = [];
    const where_data_diri = [];
    if (!_.isEmpty(query.nama)) {
      where_orang.push({
        [Op.or]: _.flatten(
          _.map(["nama_awal", "nama_akhir"], item => {
            return _.map(query.nama.split(" "), q => {
              return { [item]: { [Op.like]: `%${q}%` } };
            });
          })
        )
      });
    }
    if (!_.isEmpty(query.kos_id)) {
      where_orang.push({ kos_id: { [Op.eq]: query.kos_id } });
    }
    if (!_.isEmpty(query.orang_id)) {
      where_orang.push({ orang_id: { [Op.eq]: query.orang_id } });
    }
    if (!_.isEmpty(query.nomor_ktp)) {
      where_data_diri.push({
        nomor_ktp: { [Op.like]: `%${query.nomor_ktp}%` }
      });
    }
    if (!_.isEmpty(query.alamat)) {
      where_data_diri.push(
        sequelize.where(sequelize.col("DataDiri.alamat->jalan"), {
          [Op.like]: `%${query.alamat}%`
        })
      );
    }
    if (!_.isEmpty(query.telepon)) {
      where_data_diri.push(
        sequelize.where(sequelize.col("DataDiri.telepon->nomor"), {
          [Op.like]: `%${query.telepon}%`
        })
      );
    }
    if (!_.isEmpty(where_data_diri)) {
      include[2].where = { [Op.and]: where_data_diri };
    }
    try {
      const { count, rows } = await Orang.findAndCountAll({
        offset: (page - 1) * perpage,
        limit: perpage,
        where: {
          [Op.and]: where_orang
        },
        include,
        transaction: t
      });
      if (_.isEmpty(rows)) {
        await t.rollback();
        return Promise.reject(new Error("Orang tidak ada"));
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
      const orang = await Orang.findOne({
        where: {
          id: {
            [Op.eq]: id
          }
        },
        include: [
          {
            model: Kos,
            as: "Kos"
          },
          {
            model: Kamar,
            as: "Kamar"
          },
          {
            model: DataDiri,
            as: "DataDiri"
          }
        ],
        transaction: t
      });
      if (_.isEmpty(orang)) {
        await t.rollback();
        return Promise.reject(new Error("Orang tidak ada"));
      }
      await t.commit();
      return orang;
    } catch (err) {
      await t.rollback();
      return Promise.reject(err);
    }
  },
  async create(data) {
    const t = await transaction();
    try {
      const { orang: data_orang, datadiri: data_diri } = data;
      const datadiri = await DataDiri.findOne({
        where: {
          nomor_ktp: {
            [Op.eq]: data_diri.nomor_ktp
          }
        },
        transaction: t
      });
      if (!_.isEmpty(datadiri)) {
        await t.rollback();
        return Promise.reject(new Error("Nomor KTP sudah ada"));
      }
      const orang = await Orang.create(data_orang, { transaction: t });
      await DataDiri.create(
        {
          orang_id: orang.id,
          ...data_diri
        },
        { transaction: t }
      );
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
    const { orang: data_orang, datadiri: data_diri } = updated;
    try {
      const orang = await Orang.findOne({
        where: {
          id: {
            [Op.eq]: id
          }
        },
        include: [
          {
            model: DataDiri,
            as: "DataDiri"
          }
        ],
        transaction: t
      });
      if (_.isEmpty(orang)) {
        await t.rollback();
        return Promise.reject(new Error("Orang tidak ada"));
      }
      if (orang.DataDiri.nomor_ktp !== data_diri.nomor_ktp) {
        const checkKtp = await DataDiri.findOne({
          where: {
            nomor_ktp: {
              [Op.eq]: data_diri.nomor_ktp
            }
          },
          transaction: t
        });
        if (!_.isEmpty(checkKtp)) {
          await t.rollback();
          return Promise.reject(new Error("Nomor KTP tidak boleh sama"));
        }
      }
      await Orang.update(data_orang, {
        where: {
          id: {
            [Op.eq]: id
          }
        },
        transaction: t
      });
      await DataDiri.update(data_diri, {
        where: {
          orang_id: {
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
      await Orang.destroy({
        where: {
          id: {
            [Op.eq]: id
          }
        },
        transaction: t
      });
      await DataDiri.destroy({
        where: {
          orang_id: {
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
