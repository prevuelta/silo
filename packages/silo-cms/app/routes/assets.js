"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const HttpStatus = require("http-status-codes");
const path = require("path");
const fs = require("fs");
const readChunk = require("read-chunk");
const fileType = require("file-type");
const multer = require("multer");
const glob = require("glob");
const filesize = require("filesize");
const { settings } = require("../../config");
const { fileDir, tmpDir } = settings;

const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, fileDir);
  },
  filename: function(req, file, cb) {
    const { name, ext } = path.parse(file.originalname);
    const cleanName = name.replace(/[^A-Za-z0-9-_]/g, "").replace(/ /g, "-");
    const cleanExt = ext.toLowerCase();
    const fileName = generateFileName(0);
    function generateFileName(increment) {
      const tmpName = `${cleanName}${
        increment ? `_${increment}` : ""
      }${cleanExt}`;
      const tmpPath = path.join(tmpDir, tmpName);
      const fileExists = fs.existsSync(tmpPath);

      if (fileExists) {
        return generateFileName(increment + 1);
      } else {
        return tmpName;
      }
    }
    cb(null, fileName);
  },
  fileFilter: function(req, file, cb) {
    // if (!ALLOWED_FILES.includes(path.extension(file.originalname))) {
    // return cb(new Error('File type not allowed'));
    // }
    cb(null, true);
  },
});

const upload = multer({ storage: storage });
const assetInfoCache = {};

async function assetInfo(f, extraInfo = false) {
  const { name, ext, base } = path.parse(f);
  const typeData = await fileType.fromBuffer(readChunk.sync(f, 0, 4100));
  const stats = fs.statSync(f);
  return {
    ...typeData,
    size: filesize(+stats.size),
    created: stats.ctime,
    name: base,
    ext,
    isImage: typeData && typeData.mime.includes("image"),
  };
}

function getAssetPath(asset) {
  return path.join(fileDir, asset);
}

router
  .route("/:asset?")
  // .all(auth.api)
  .get(auth.jwt, (req, res) => {
    const { asset } = req.params;
    if (!asset) {
      glob(`${fileDir}/*`, { nodir: true }, async (err, files) => {
        if (err) {
          res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
          return;
        }
        const response = await Promise.all(files.map(f => assetInfo(f)));
        res.send(response);
      });
    } else {
      const assetPath = getAssetPath(asset);
      if (fs.existsSync(assetPath)) {
        const info = await(
          assetInfoCache[assetPath] || assetInfo(assetPath, true)
        );
        assetInfoCache[assetPath] = info;
        res.send(info);
      } else {
        res.sendStatus(HttpStatus.NOT_FOUND);
      }
    }
  })
  .delete(auth.jwt, (req, res) => {
    const { asset } = req.body;
    const path = getAssetPath(asset);
    fs.unlinkSync(path);
    res.sendStatus(HttpStatus.OK);
  })
  .post(auth.jwt, upload.single("file"), (req, res, next) => {
    const { path: filePath, size, filename, originalname, mimetype } = req.file;
    res.sendStatus(HttpStatus.OK);
  });

module.exports = router;
