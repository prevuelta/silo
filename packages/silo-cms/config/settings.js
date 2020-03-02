"use strict";

const path = require("path");
const fs = require("fs");

require("dotenv").config({ path: "config/.env" });

const { env } = process;

const defaults = {
  appName: "Silo CMS",
  dbPath: "app/db/app.db",
  schemaDir: "schema",
  fileDir: "assets",
  dataDir: "data",
  tmpDir: "tmp",
  siteDir: path.resolve(__dirname, "../"),
};

module.exports = {
  domain: env.DOMAIN,
  siteDir: defaults.siteDir,
  appName: env.APP_NAME || defaults.appName,
  dbPath: env.DB_PATH || defaults.dbPath,
  schemaDir: env.SCHEMA_PATH || defaults.schemaDir,
  fileDir: env.FILE_DIR || defaults.fileDir,
  dataDir: env.DATA_DIR || defaults.dataDir,
  tmpDir: env.TMP_DIR || defaults.tmpDir,
  sessionSecret: env.SESSION_SECRET,
  jwt: {
    secret: env.JWT_SECRET,
  },
  port: env.PORT || 9001,
};
