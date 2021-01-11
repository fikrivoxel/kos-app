const Sequelize = require("sequelize");
const mysql2 = require("mysql2");
const config_db = require("@/config/database.json");

const env = process.env.NODE_ENV || "development";
const config = config_db[env];
let models = {};

if (config.dialect === "mysql") {
  config.dialectModule = mysql2;
}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const files = require.context("../../../models", false, /\.js$/);

files.keys().forEach(file => {
  let model;
  if (_.has(files(file), "default")) {
    model = files(file).default(sequelize, Sequelize.DataTypes);
  } else {
    model = files(file)(sequelize, Sequelize.DataTypes);
  }
  models[model.name] = model;
});

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.Op = Sequelize.Op;

models.authenticationDB = async () => {
  try {
    if (env === "development") {
      await sequelize.sync({ alter: true });
    }
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

models.transaction = async () => {
  const trans = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.READ_UNCOMMITTED || "READ UNCOMMITTED"
  });
  return trans;
};

module.exports = models;
