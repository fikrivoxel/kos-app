const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kos extends Model {
    static associate(model) {
      Kos.hasMany(model.Kamar, {
        foreignKey: "kos_id"
      });
      Kos.hasMany(model.Orang, {
        foreignKey: "kos_id"
      });
    }
  }
  Kos.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      nama: DataTypes.STRING,
      alamat: DataTypes.STRING,
      harga_default: DataTypes.FLOAT
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      modelName: "Kos"
    }
  );
  return Kos;
};
