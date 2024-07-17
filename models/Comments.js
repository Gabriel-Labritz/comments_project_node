const { DataTypes } = require("sequelize");
const db = require("../db/connection");

// models
const User = require("./User");

const Comments = db.define("Comments", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
});

// relation
Comments.belongsTo(User);
User.hasMany(Comments);

module.exports = Comments;
