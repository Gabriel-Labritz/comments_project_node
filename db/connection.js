const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("comments", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
} catch (err) {
  console.log("Erro ao se conectar ao MySql!", err);
}

module.exports = sequelize;
