const { stamps, sequelize } = require("../sequelizePath");
const Sequelize = require("sequelize");

const schema = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  otp: {
    type: Sequelize.CHAR(10),
  },
  phone: {
    type: Sequelize.CHAR(16),
  },
  ...stamps,
};

const OTP = sequelize.define("otpMaster", schema);
module.exports = OTP;
