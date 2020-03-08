"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { settings } = require("../../config");
const Silo = require("../core/silo");

const router = express.Router();

router.use(auth.jwt);
router.use(auth.isAdmin);

router.get("/", (req, res) => {
  res.render("pages/admin", {
    user: req.session.user
  });
});

router.post("/token", (req, res) => {
  const { id, type } = req.body;
  if (type === "user") {
    Users.getUserById(id)
      .then(result => {
        if (result) {
          let token = jwt.sign({ user: result._id }, settings.jwt.secret, {
            issuer: settings.jwt.issuer
          });
          res.send({
            token
          });
        } else {
          res.sendStatus(HttpStatus.BAD_REQUEST);
        }
      })
      .catch(err => {
        console.warn(err);
        res.sendStatus(HttpStatus.UNAUTHORIZED);
      });
  } else {
    res.sendStatus(HttpStatus.BAD_REQUEST);
  }
});

module.exports = router;
