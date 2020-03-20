"use strict";

const path = require("path");
const fs = require("fs");

require("dotenv").config({ path: "config/.env" });

const { env } = process;
const { SITE_DIR } = env;

const defaults = {
  appName: "Silo CMS",
  dbPath: `${SITE_DIR}/db/app.db`,
  schemaDir: `${SITE_DIR}/schema`,
  fileDir: `${SITE_DIR}/assets`,
  dataDir: `${SITE_DIR}/data`,
  tmpDir: `${SITE_DIR}/tmp`,
  siteDir: SITE_DIR || siloDir,
  siloDir,
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
