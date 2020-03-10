"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { settings } = require("../../config");
const Users = require("../core/users");

const router = express.Router();

router
  .route("/setup")
  .get(async (req, res) => {
    const userCount = await Users.getUserCount();
    console.log("Setup", userCount);
    if (userCount) {
      res.redirect("/admin");
    } else {
      res.render("pages/setup");
    }
  })
  .post(async (req, res, next) => {
    const user = req.body;
    console.log(user);

    if (user.initial) {
      const userCount = await Users.getUserCount();
      if (userCount) {
        res.redirect("/admin");
      } else {
        // TODO: add validation
        delete user["confirm-password"];
        delete user.initial;
        Users.createUser(user)
          .then(result => {
            console.log(result);
            // res.sendStatus(HttpStatus.OK);
            res.redirect("/admin");
            return;
          })
          .catch(err => {
            console.warn(err);
            req.flash("info", "Error creating user");
            res.render("pages/setup");
            // res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
          });
      }
    }
  });

router
  .route("/")
  .get(async (req, res, next) => {
    const userCount = await Users.getUserCount();
    if (!userCount) {
      res.redirect("/setup");
      return;
    }
    console.log("root", userCount);
    passport.authenticate("jwt", (err, user, info) => {
      if (!user) {
        res.render("pages/login", { siloHasUsers: userCount > 0 });
      } else {
        res.redirect("/admin/manage");
      }
    })(req, res, next);
  })

  .post(async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        next(err);
      }
      if (!user) {
        req.flash("info", "Username or password incorrect");
        res.render("pages/login");
      } else {
        let token = jwt.sign({ user: user.id }, settings.jwt.secret, {
          expiresIn: "3 days",
        });
        res.cookie("jwt", token);
        req.session.user = {
          id: user.id,
          username: user.username,
          isAdmin: user.admin,
        };
        req.session.flash = [];
        res.redirect("/admin/manage");
      }
    })(req, res, next);
  });

module.exports = router;
