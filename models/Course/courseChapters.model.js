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
  numberOfLectures: {
    type: Sequelize.INTEGER(4),
  },
  averageLectureTime: {
    type: Sequelize.DOUBLE,
  },
  chapterOrder: {
    type: Sequelize.INTEGER,
  },
  chapterDescription: {
    type: Sequelize.STRING,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  ...stamps,
};

const CoursesChapters = sequelize.define("coursesChapters", schema);
module.exports = CoursesChapters;
