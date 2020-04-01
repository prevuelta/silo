"use strict";

const glob = require("glob");
const minimist = require("minimist");
const execSync = require("child_process").execSync;
const chalk = require("chalk");
const commandExistsSync = require("command-exists").sync;
const fs = require("fs");
const { exit, error, note, log, warn } = require("./util");
const resolve = require("resolve");

const commands = require("./commands");

function entry(cwd = process.cwd(), args) {
  process.title = "Silo";
  args = args || minimist(process.argv.slice(2));

  let cmd = "";

  if (args.version || args.v) {
    cmd = "version";
  } else {
    cmd = args._.shift();
  }

  if (!cmd) {
    exit();
  }

  if (!commands[cmd]) {
    warn(`Unknown command "${cmd}"`);
    log("  Usage: silo <comand>");
    log("  Commands:");
    log("    build");
    log("    init");
    log("    dev");
    log("    resources\tLists schema");
    log("    create-user");
    exit();
  }

  commands[cmd](cwd, args)
    .then(output => {
      if (output) {
        log(output);
      }
      exit();
    })
    .catch(err => {
      warn(`${cmd} failed ${err}`);
      exit();
    });
}

module.exports = entry;
