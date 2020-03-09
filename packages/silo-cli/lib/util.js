"use strict";

const chalk = require("chalk");
const { spawn } = require("child_process");

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

function run(cmdStr, opt = {}) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = cmdStr.split(" ");
    const command = spawn(cmd, args, { stdio: ["inherit"], ...opt });

    command.stdout.on("data", data => {
      log(data);
    });

    command.stderr.on("data", data => {
      warn(`Error running command '${cmdStr}'`);
      warn(data);
      reject();
    });

    command.on("exit", async code => {
      if (code === 1) {
        warn(`${cmdStr} failed: ${code}`);
        reject();
        return;
      }
      resolve();
    });
  });
}

module.exports = {
  error,
  exit,
  log,
  note,
  run,
  warn,
};
