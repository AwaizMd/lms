if (process.env.NODE_ENV == "PRODUCTION") {
  console.log("\x1b[41m%s\x1b[0m", "Currently in production. Be Cautious");
  module.exports = require("./environments/production");
} else {
  console.log("\x1b[42m%s\x1b[0m", "In Development mode");
  module.exports = require("./environments/development");
}
