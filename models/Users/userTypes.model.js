const { stamps, sequelize } = require("../sequelizePath");
const Sequelize = require("sequelize");

const schema = {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  type: {
    type: Sequelize.CHAR(50),
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  ...stamps,
};

const UserTypes = sequelize.define("userTypes", schema);
module.exports = UserTypes;
