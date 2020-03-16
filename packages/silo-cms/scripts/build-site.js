import pug from "pug";
import glob from "glob";
import fs from "fs";
import path from "path";

const { SITE_DIR } = process.env;

const DIST_DIR = `${SITE_DIR}/dist`;
const DATA_DIR = `${SITE_DIR}/data`;

if (!SITE_DIR) {
  console.warn("SITE_DIR not set");
  process.exit(1);
}

if (!fs.existsSync(DIST_DIR)) {
  console.warn("/dist does not exist");
  process.exit(1);
}

function getName(filePath) {
  const name = path.parse(filePath).name.replace(/[^a-zA-Z0-9-_]/g, "");
  return name === "" ? `autoname-${+new Date()}` : name;
}

const data = glob.sync(`${DATA_DIR}/*.json`).reduce((dataObj, dataFile) => {
  const dataName = getName(dataFile);
  dataObj[dataName] = require(dataFile);
  return dataObj;
}, {});

const pages = glob.sync(`${SITE_DIR}/src/views/pages/*.pug`);

pages.forEach(page => {
  const name = getName(page);
  const html = pug.renderFile(page, { data });
  fs.writeFileSync(`${DIST_DIR}/${name}.html`, html);
});
