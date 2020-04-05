import pug from "pug";
import glob from "glob";
import fs from "fs";
import path from "path";
import gm from "gm";

const im = gm.subClass({ imageMagick: true });

const { SITE_DIR } = process.env;

const DIST_DIR = `${SITE_DIR}/dist`;
const DATA_DIR = `${SITE_DIR}/data`;
const ASSET_DIR = `${SITE_DIR}/assets`;

if (!SITE_DIR) {
  console.warn("SITE_DIR not set");
  process.exit(1);
}

if (!fs.existsSync(DIST_DIR)) {
  console.warn("/dist does not exist");
  process.exit(1);
}

function imageSize(imagePath, size) {
  if (!imagePath) {
    return;
  }
  const partials = path.parse(imagePath);
  const filename = `${partials.name}${size ? `_${size}` : ""}${partials.ext}`;
  const url = `/assets/${filename}`;
  const tmpPath = path.join(SITE_DIR, "dist", url);
  const filePath = `${ASSET_DIR}/${imagePath}`;
  console.log(tmpPath, filePath);
  if (!fs.existsSync(tmpPath) && size && fs.existsSync(filePath)) {
    im(filePath)
      .resize(size)
      .write(tmpPath, err => {
        if (err) {
          console.log("Err", err);
        } else {
          console.log("File resized");
        }
      });
  } else {
    console.log("Couldn't resize image", tmpPath);
  }
  return url;
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
  const html = pug.renderFile(page, {
    data,
    // Helper functions
    imageSize,
  });
  fs.writeFileSync(`${DIST_DIR}/${name}.html`, html);
});

console.log("HTML pages created");
