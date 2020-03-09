const { dev, serve } = require("./serve");

module.exports = {
  build: require("./build.js"),
  init: require("./init.js"),
  schema: require("./schema.js"),
  version: require("./version.js"),
  dev,
  serve,
};
