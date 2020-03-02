"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { settings } = require("../../config");
const Silo = require("../core/silo");

const router = express.Router();

// let silos;
// require('../core/silos')
// .then(data => {
// silos = data;
// })
// .catch(err => {
// console.log(err);
// });

router.use(auth.jwt);
router.use(auth.isAdmin);

router.get("/", (req, res) => {
  res.render("pages/admin", {
    users: [],
    silos: [],
    signals: [],
    user: req.session.user,
  });
});

router.post("/token", (req, res) => {
  const { id, type } = req.body;
  if (type === "user") {
    Users.getUserById(id)
      .then(result => {
        if (result) {
          let token = jwt.sign({ user: result._id }, settings.jwt.secret, {
            issuer: settings.jwt.issuer,
          });
          res.send({
            token,
          });
        } else {
          res.sendStatus(HttpStatus.BAD_REQUEST);
        }
      })
      .catch(err => {
        console.warn(err);
        res.sendStatus(HttpStatus.UNAUTHORIZED);
      });
  } else if (type === "consumer") {
    Consumers.getConsumerById(id)
      .then(result => {
        if (result) {
          let token = jwt.sign({ consumer: result._id }, settings.jwt.secret, {
            issuer: settings.jwt.issuer,
          });
          res.send({
            token,
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

router
  .route("/consumer")
  .get((req, res) => {
    Consumers.getAll()
      .then(result => {
        if (result) {
          res.send(result);
        } else {
          res.sendStatus(HttpStatus.BAD_REQUEST);
        }
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      });
  })
  .post((req, res) => {
    const data = req.body;
    if (data.name && data.resource) {
      Consumers.createConsumer({
        ...data,
        created: new Date(),
      })
        .then(result => {
          console.log(result);
          res.sendStatus(HttpStatus.OK);
        })
        .catch(err => {
          console.warn(err);
          res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    } else {
      res.sendStatus(HttpStatus.BAD_REQUEST);
    }
  })
  .delete((req, res) => {
    Consumers.removeConsumer(req.body.id)
      .then(result => {
        res.sendStatus(HttpStatus.OK);
      })
      .catch(err => {
        console.warn(err);
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      });
  });

module.exports = router;
