const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pemesanan extends Model {
    static associate(model) {
      Pemesanan.belongsTo(model.Kamar, {
        foreignKey: "kamar_id",
        as: "Kamar"
      });
      Pemesanan.belongsTo(model.Orang, {
        foreignKey: "orang_id",
        as: "Orang"
      });
      Pemesanan.hasMany(model.Pembayaran, {
        foreignKey: "pemesanan_id",
        as: "Pembayaran"
      });
    }
  }
  Pemesanan.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      tgl_masuk: DataTypes.DATE,
      tgl_keluar: DataTypes.DATE,
      batas_akhir: DataTypes.DATE,
      harga: DataTypes.FLOAT,
      kekurangan: DataTypes.FLOAT,
      status: DataTypes.ENUM("lunas", "hutang"),
      kamar_id: DataTypes.UUID,
      orang_id: DataTypes.UUID
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      modelName: "Pemesanan"
    }
  );
  return Pemesanan;
};
