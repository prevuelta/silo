"use strict";

const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const Db = require("../db/db");

const db = Db();

const salt = bcrypt.genSaltSync(10);

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  hash: Joi.string()
    // .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  created: Joi.date().required(),
  admin: Joi.boolean()
    .default(false)
    .required(),
  role: Joi.number()
    .allow(0, 1, 2)
    .default(0)
});

module.exports = {
  async getAll() {
    return db.all(`SELECT * FROM user`);
  },
  async getUserCount() {
    const users = await this.getAll();
    return users.length;
  },
  async getUserById(id) {
    return db.get("SELECT * FROM user WHERE id = ?", { 1: id });
  },
  async getUserByName(name) {
    return db.get("SELECT * FROM user WHERE username = ?", { 1: username });
  },
  async getUserByEmail(email) {
    return db.get("SELECT * FROM user WHERE email  = ?", { 1: email });
  },
  async authenticateUser(creds) {
    return this.getUserByEmail(creds.email).then(user => {
      if (user && bcrypt.compareSync(creds.password, user.hash)) {
        return user;
      } else {
        throw new Error("Authentication failed");
        return null;
      }
    });
  },
  createUser(data) {
    data.created = +new Date();
    data.hash = bcrypt.hashSync(data.password, salt);
    delete data.password;

    const valid = schema.validate(data);
    console.log(valid);
    if (valid.error) {
      return Promise.reject("User data invalid");
    }
    let values = Object.keys(data).map(k => data[k]);
    let q = `INSERT INTO user(${Object.keys(data).join(
      ","
    )}) VALUES(${Object.keys(data)
      .map(k => "?")
      .join(", ")})`;
    console.log(q, values);
    return db.run(q, values);
  },
  updateUser(id, data) {
    const valid = schema.validate(data);
    if (valid.error) {
      let values = Object.values(data);
      let q = `UPDATE user SET ${Object.keys(data)
        .map(key => `${key} = ?`)
        .join(", ")} WHERE id = ?`;
      return db.run(q, [...values, id]);
    }
  },
  deleteUser(id) {
    return db.run("DELETE FROM user WHERE id = ?", [id]);
  },
  resourcePermissions(resource, id) {
    // return this.getUserById(id).then(user => {
    // return (
    // (user &&
    // user.resources &&
    // user.resources.find(r => r.resource === resource)) ||
    // []
    // );
    // });
  },
  async getResourcesById(id) {
    return db
      .all(
        "SELECT * FROM resource_permissions WHERE resource_permissions.user = ?",
        { 1: id }
      )
      .then(permissions => {
        return permissions || [];
      });
  }
};
