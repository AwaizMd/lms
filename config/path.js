const fs = require("fs");
const path = require("path");
const fileNames = () => {
  const files = fs.readdirSync(path.join(__dirname, "..", "routers"));
  return files.map((file) => {
    return file.split(".")[0];
  });
};

exports.include = (router) => {
  const files = fileNames();
  for (let x of files) {
    router.use(`/${x}`, require(`../routers/${x}.router.js`));
  }
  return router;
};