const EntitySchema = require("typeorm").EntitySchema;
const User = require("../models/User").User;
const Role = require("../models/Role").Role;

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  target: User,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    role_id: {
      type: "int",
      nullable: false,
      index: true
    },
    login: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    password: {
      type: "text",
      nullable: false,
    }
  },
  relations: {
    role: {
      type: 'many-to-one',
      target: 'Role',
      joinColumn: {
        name: 'role_id',
      },
    },
  }
});