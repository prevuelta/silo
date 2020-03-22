#!/bin/node

const fs = require("fs");
const sPkg = require("../packages/silo-cms/package.json");

const { version } = sPkg;

const ssPkg = require("../packages/silo-starter/package.json");

ssPkg.dependencies["silo-cms"] = version;

fs.writeFileSync(
  `${process.cwd()}/packages/silo-starter/package.json`,
  JSON.stringify(ssPkg)
);
