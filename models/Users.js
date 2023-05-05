// import { Sequelize, Model, DataTypes } from 'sequelize';
const Sequelize = require("sequelize");
const sequelize = require('../db');

const User = sequelize.define('User', {
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  role_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  login: {
    type: Sequelize.STRING(60),
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING(120),
    allowNull: false,
  },
});

const Role = require('./Roles');
User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = User;