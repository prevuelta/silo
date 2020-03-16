"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const HttpStatus = require("http-status-codes");
const execSync = require("child_process").sync;
const { run } = require("../util");

const router = express.Router();

router.use(auth.jwt);

router.route("/rebuild").get((req, res, next) => {
  run("node -r esm ./scripts/build-site.js", {
    env: {
      ...process.env,
      SITE_DIR: process.env.SITE_DIR
    }
  })
    .then(code => {
      res.send(HttpStatus.SUCCESS);
    })
    .catch(err => {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
});

module.exports = router;
