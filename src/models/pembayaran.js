const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pembayaran extends Model {
    static associate(model) {
      Pembayaran.belongsTo(model.Pemesanan, {
        foreignKey: "pemesanan_id",
        as: "Pemesanan"
      });
    }
  }
  Pembayaran.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      tgl_transaksi: DataTypes.DATE,
      bayar: DataTypes.FLOAT,
      tipe: DataTypes.ENUM("bank", "kontan"),
      pemesanan_id: DataTypes.UUID
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      modelName: "Pembayaran"
    }
  );
  return Pembayaran;
};
