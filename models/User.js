const { DataTypes } = require("sequelize");
const db = require("../db/connection");

const User = db.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
});

module.exports = User;
