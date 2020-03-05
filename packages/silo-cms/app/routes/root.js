"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { settings } = require("../../config");
const Users = require("../core/users");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const userCount = await Users.getUserCount();
  passport.authenticate("jwt", (err, user, info) => {
    if (!user) {
      res.render("pages/login", { siloHasUsers: userCount > 0 });
    } else {
      res.redirect("/admin/manage");
    }
  })(req, res, next);
});

router.post("/", async (req, res, next) => {
  const userCount = await Users.getUserCount();
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
    }
    const userCount = 1;
    if (!user) {
      req.flash("info", "Username or password incorrect");
      res.render("pages/login", { siloHasUsers: userCount > 0 });
    } else {
      let token = jwt.sign({ user: user.id }, settings.jwt.secret, {
        expiresIn: "3 days"
      });
      res.cookie("jwt", token);
      req.session.user = {
        id: user.id,
        username: user.username,
        isAdmin: user.admin
      };
      req.session.flash = [];
      res.redirect("/admin/manage");
    }
  })(req, res, next);
});

module.exports = router;
