const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Orang extends Model {
    static associate(model) {
      Orang.belongsTo(model.Kos, {
        foreignKey: "kos_id",
        as: "Kos"
      });
      Orang.belongsTo(model.Kamar, {
        foreignKey: "kamar_id",
        as: "Kamar"
      });
      Orang.hasOne(model.DataDiri, {
        foreignKey: "orang_id",
        as: "DataDiri"
      });
      Orang.hasMany(model.Pemesanan, {
        foreignKey: "orang_id",
        as: "Pemesanan"
      });
    }
  }
  Orang.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      nama_awal: DataTypes.STRING,
      nama_akhir: DataTypes.STRING,
      kamar_id: DataTypes.UUID,
      kos_id: DataTypes.UUID
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      modelName: "Orang"
    }
  );
  return Orang;
};
