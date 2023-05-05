const Sequelize = require("sequelize");
const sequelize = require('../db');

const Roles = sequelize.define(
  'Roles', 
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(60),
      allowNull: false,
      unique: true, 
      defaultValue: "USER"
    },
  },
  { 
    timestamps: false
  }
);

module.exports = Roles;