"use strict";

const pkg = require("../../package.json");
const resolve = require("resolve");

console.log(resolve.sync("silo-cli"));

function version(args) {
  return `v${pkg.version}`;
}

module.exports = () => Promise.resolve(version());
