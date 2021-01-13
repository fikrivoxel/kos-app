const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kamar extends Model {
    static associate(model) {
      Kamar.belongsTo(model.Kos, {
        foreignKey: "kos_id"
      });
      Kamar.hasMany(model.Orang, {
        foreignKey: "kamar_id"
      });
    }
  }
  Kamar.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      nama: DataTypes.STRING,
      harga_default: DataTypes.FLOAT,
      dihuni: DataTypes.BOOLEAN,
      kos_id: DataTypes.UUID
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      modelName: "Kamar"
    }
  );
  return Kamar;
};
