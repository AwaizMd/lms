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
  link: {
    type: Sequelize.STRING,
  },
  duration: {
    type: Sequelize.DOUBLE,
  },
  contentOrder: {
    type: Sequelize.INTEGER,
  },
  contentType: {
    type: Sequelize.ENUM('IMG', 'MP4', 'TXT', 'PDF', 'DOC', 'DOCX', 'HTML', 'DATA'),
    //file type or from database table lms_course_content_data.If not data ignore lms_type.
    defaultValue: "DATA"
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  ...stamps,
};

const CoursesContents = sequelize.define("coursesContents", schema);
module.exports = CoursesContents;