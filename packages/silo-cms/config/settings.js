"use strict";

const path = require("path");
const fs = require("fs");

require("dotenv").config({ path: "config/.env" });

const siloDir = process.cwd();

const { env } = process;
const {
  SITE_DIR,
  PORT,
  DOMAIN,
  APP_NAME,
  DB_PATH,
  SCHEMA_PATH,
  FILE_DIR,
  DATA_DIR,
  TMP_DIR,
  SESSION_SECRET,
  JWT_SECRET,
} = env;

const defaults = {
  appName: "Silo CMS",
  dbPath: `${SITE_DIR}/db/app.db`,
  schemaDir: `${SITE_DIR}/schema`,
  fileDir: `${SITE_DIR}/assets`,
  dataDir: `${SITE_DIR}/data`,
  tmpDir: `${SITE_DIR}/tmp`,
  siteDir: SITE_DIR,
  siloDir,
};

module.exports = {
  domain: DOMAIN,
  siteDir: defaults.siteDir,
  siloDir: defaults.siloDir,
  appName: APP_NAME || defaults.appName,
  dbPath: DB_PATH || defaults.dbPath,
  schemaDir: SCHEMA_PATH || defaults.schemaDir,
  fileDir: FILE_DIR || defaults.fileDir,
  dataDir: DATA_DIR || defaults.dataDir,
  tmpDir: TMP_DIR || defaults.tmpDir,
  sessionSecret: SESSION_SECRET,
  jwt: {
    secret: JWT_SECRET,
  },
  port: PORT || 9001,
};
