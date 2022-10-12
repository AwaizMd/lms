const { stamps, sequelize } = require("../sequelizePath");
const Sequelize = require("sequelize");

const schema = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.CHAR(200),
  },
  price: {
    type: Sequelize.DOUBLE,
  },
  offerPrice: {
    type: Sequelize.DOUBLE,
  },
  thumbnailLink: {
    type: Sequelize.STRING,
  },
  durationInHours: {
    type: Sequelize.DOUBLE,
  },
  avgRatings: {
    type: Sequelize.DOUBLE,
    defaultValue: 0,
  },
  noOfRatings: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  ...stamps,
};

const Courses = sequelize.define("courses", schema);
module.exports = Courses;
