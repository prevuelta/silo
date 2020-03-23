"use strict";

const pkg = require("../../package.json");

function version(args) {
  return `v${pkg.version}`;
}

module.exports = () => Promise.resolve(version());
