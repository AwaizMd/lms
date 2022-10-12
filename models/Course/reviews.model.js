const { stamps, sequelize } = require("../sequelizePath");
const Sequelize = require("sequelize");

const schema = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title:{
    type:Sequelize.STRING,
  },
  ratings: {
    type: Sequelize.DOUBLE,
  },
  review: {
    type:Sequelize.STRING,
  },
  ...stamps,
};

const Reviews = sequelize.define("reviews", schema);
module.exports = Reviews;