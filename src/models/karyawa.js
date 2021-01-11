const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Karyawan extends Model {
    static associate() {}
  }
  Karyawan.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      nama_awal: DataTypes.STRING,
      nama_akhir: DataTypes.STRING
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      modelName: "Karyawan"
    }
  );
  return Karyawan;
};
