const { stamps, sequelize } = require("../sequelizePath");
const Sequelize = require("sequelize");

const schema = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.CHAR(255),
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  ...stamps,
};

const SubCategory = sequelize.define("courseSubCategory", schema);
module.exports = SubCategory;
