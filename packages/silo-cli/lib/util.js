"use strict";

const chalk = require("chalk");

function warn(msg) {
    log(chalk.red(msg));
}

function note(msg) {
    log(chalk.green(msg));
}

function log(msg, type = "") {
    console.log("%s %s", type || msg, type && msg);
}

function error(err) {
    throw new Error(err);
}

function exit() {
    process.exit();
}

module.exports = {
    warn,
    note,
    log,
    error,
    exit,
};
