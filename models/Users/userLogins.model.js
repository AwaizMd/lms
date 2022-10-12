const { sequelize } = require("../sequelizePath");
const Sequelize = require("sequelize");

const schema = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.CHAR(128),
  },
  password: {
    type: Sequelize.CHAR(128),
  },
  phone:{
    type: Sequelize.CHAR(16),
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  lastActive: {
    type: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE
  }
};

const UserLogins = sequelize.define("userLogins", schema);
module.exports = UserLogins;
