const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DataDiri extends Model {
    static associate(model) {
      DataDiri.belongsTo(model.Orang, {
        foreignKey: "orang_id",
        as: "Orang"
      });
    }
  }
  DataDiri.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      nomor_ktp: DataTypes.STRING,
      alamat: DataTypes.JSON,
      telepon: DataTypes.JSON,
      orang_id: DataTypes.UUID
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      modelName: "DataDiri"
    }
  );
  return DataDiri;
};
