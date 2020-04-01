"use strict";

const commandExistsSync = require("command-exists").sync;
const { spawn } = require("child_process");
const pkg = require("../../package.json");
const { exit, error, note, log, warn, run } = require("../util");
const fs = require("fs-extra");
const chalk = require("chalk");
const del = require("del");
const glob = require("glob");
const { script } = require("./scripts");

const GIT_REPO_URL = "https://github.com/prevuelta/silo";

function init(cwd, args) {
  if (args._[0]) {
    cwd = args._[0];
  }

  return new Promise(async (resolve, reject) => {
    if (fs.existsSync(cwd) && fs.readdirSync(cwd).length > 0) {
      warn("Please install in an empty directory");
      reject();
      return;
    }
    if (!commandExistsSync("git")) {
      warn("Please install git to continue");
      reject();
      return;
    }

    note(`Cloning silo-starter into ${cwd}...`);

    try {
      await run(`git clone --quiet --depth=1 ${GIT_REPO_URL} ${cwd}`);
      // Remove .git dir

      // Check if silo installed

      // note("Creating directories...");
      await fs.move(`${cwd}/packages/silo-starter`, `${cwd}/silo-starter`);

      await del([`${cwd}/*`, `!${cwd}/silo-starter`]);

      const files = glob.sync(`${cwd}/silo-starter/*`);
      files.forEach(file => {
        fs.moveSync(file, file.replace("/silo-starter", ""));
      });

      await del([`${cwd}/silo-starter`, ".git"]);

      ["tmp", "dist", "schema", "assets", "data"].map(dir =>
        fs.mkdirp(`${cwd}/${dir}`)
      );

      console.log("Finished phase 1");
    } catch (err) {
      log(err);
      warn(`Install failed, reverting`);
      await del([`${cwd}/*`, ".git", ".gitignore"]);
      return;
    }

    note("npm install...");

    try {
      await run(`npm install --prefix ${cwd}`);
    } catch (err) {
      log(err);
      warn("Failed to install dependancies, please run 'npm install' manually");
    }
    try {
      await script(cwd, args, "init");
    } catch (err) {
      log(err);
      warn("Init script failed");
    }
    try {
      await script(cwd, args, "build");
    } catch (err) {
      log(err);
      warn("Failed to build site");
    }
    log("Silo installed!");
    resolve();
  });
}

module.exports = init;
