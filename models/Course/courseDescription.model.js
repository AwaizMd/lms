const { stamps, sequelize } = require("../sequelizePath");
const Sequelize = require("sequelize");

const schema = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: Sequelize.STRING,
  },
  shortDescription: {
    type: Sequelize.STRING,
  },
  whatYouWillLearn: {
    type: Sequelize.STRING,
  },
  prerequisites: {
    type: Sequelize.JSON,
  },
  keywords: {
    type: Sequelize.STRING,
  },
  audienceType: {
    type: Sequelize.ENUM("ALL", "BEGINNER", "INTERMIDIATE", "ADVANCED"),
    defaultValue: "ALL",
  },
  courseTimeline: {
    type: Sequelize.CHAR(255),
  },
  courseCertificate: {
    type: Sequelize.BOOLEAN,
  },
  courseIntroUrl: {
    type: Sequelize.STRING,
  },
  coursePublisheType: {
    type: Sequelize.ENUM("DRAFT", "PRE-ANNOUNCEMENT", "PUBLISHED"),
    defaultValue: "PUBLISHED",
  },
  ...stamps,
};

const CoursesDescription = sequelize.define("coursesDescription", schema);
module.exports = CoursesDescription;
