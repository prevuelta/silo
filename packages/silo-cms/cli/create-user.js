"use strict";

const Users = require("../app/core/users.js");
const prompt = require("prompt");
const bcrypt = require("bcrypt");

const salt = bcrypt.genSaltSync(10);

prompt.start();

prompt.get(
    [
        {
            name: "username",
            required: true,
        },
        {
            name: "password",
            message: "password (must be longer than 6 characters)",
            required: true,
            hidden: true,
        },
        {
            name: "confirm",
            message: "Confirm password",
            required: true,
            hidden: true,
            conform: async function(value) {
                if (value === prompt.history("password").value) {
                    return value.length > 6;
                } else {
                    return false;
                }
            },
        },
        {
            name: "email",
            required: true,
        },
        {
            name: "admin",
            default: false,
            type: "boolean",
            required: true,
        },
        {
            name: "role",
            required: true,
        },
    ],
    async function(err, result) {
        result.hash = await bcrypt.hash(result.password, salt);
        delete result.password;
        delete result.confirm;
        result.created = +new Date();
        if (err) {
            console.log(err);
            return;
        }
        const user = Users.createUser(result);
        if (user) {
            console.log("User created");
        } else {
            console.warn("Sorry, an error occured");
        }
    }
);
