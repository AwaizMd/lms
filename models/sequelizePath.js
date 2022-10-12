const {
  stamps,
  passwordHooks,
  sequelize,
} = require("../services/sequelize.service")().opts();
module.exports = { stamps, passwordHooks, sequelize };
