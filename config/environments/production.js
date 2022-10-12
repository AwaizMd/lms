let common = require("../common");

common.db.name = process.env.DB_NAME;
common.server.port = process.env.PORT;

module.exports = common;