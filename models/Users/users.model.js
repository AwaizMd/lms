const { stamps, sequelize } = require("../sequelizePath");
const Sequelize = require("sequelize");

const schema = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: Sequelize.CHAR(128),
  },
  lastName: {
    type: Sequelize.CHAR(128),
  },
  email: {
    type: Sequelize.CHAR(128),
  },
  state: {
    type: Sequelize.CHAR(150),
  },
  city: {
    type: Sequelize.CHAR(255),
  },
  dob: {
    type: Sequelize.DATE,
  },
  isEmailVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isContactVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  ...stamps,
};
let options = {};
options.indexes = [
  {
    fields: ["email", "contactNumber"],
    unique: true,
  },
];

const User = sequelize.define("users", schema);
module.exports = User;
