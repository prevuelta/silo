"use strict";

const commandExistsSync = require("command-exists").sync;
const { spawn } = require("child_process");
const pkg = require("../../package.json");
const { exit, error, note, log, warn } = require("../util");
const fs = require("fs-extra");
const chalk = require("chalk");
const del = require("del");
const glob = require("glob");

const GIT_REPO_URL = "https://github.com/prevuelta/silo";

function init(cwd, args) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(cwd) && fs.readdirSync(cwd).length > 0) {
            warn("Please install in an empty directory");
            reject();
        }
        if (!commandExistsSync("git")) {
            warn("Please install git to continue");
            reject();
        }

        note("Cloning silo-starter...");

        // execSync(`git clone ${GIT_REPO_URL}; rm -rf .git;`, {
        //     stdio: 'inherit',
        // });
        const git = spawn("git", ["clone", "--depth=1", "--quiet", GIT_REPO_URL, cwd]);

        git.stdout.on("data", data => {
            log(data);
        });

        git.stderr.on("data", data => {
            warn("git clone failed");
            reject();
        });

        git.on("exit", async code => {
            if (code === 1) {
                warn("Failed to install dependancies, please run 'npm install' manually");
                reject();
            } else {
                // Remove .git dir
                console.log(cwd);

                // Check if silo installed

                // note("Creating directories...");
                await fs.move(`${cwd}/packages/silo-starter`, `${cwd}/silo-starter`);

                await del([`${cwd}/*`, `!${cwd}/silo-starter`]);

                const files = glob.sync(`${cwd}/silo-starter/*`);
                files.forEach(file => {
                    fs.moveSync(file, file.replace("/silo-starter", ""));
                });

                await del([`${cwd}/silo-starter`, ".git"]);

                ["dist", "schema", "assets", "data"].map(dir => fs.mkdirp(`${cwd}/${dir}`));

                // Generate secrets
                note("Running npm install...");
                // Run npm install
                // npm install
                log("Silo installed!");
                resolve();
            }
        });
    });
}

module.exports = init;
