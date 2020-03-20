const { dev, serve, devSilo, build } = require("./scripts");

module.exports = {
  schema: require("./schema.js"),
  version: require("./version.js"),
  init: require("./init.js"),
  build,
  dev,
  "dev-silo": devSilo,
  serve,
};
