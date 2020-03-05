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

function run(str) {
    return new Promise((res, rej) => {
        const [cmd, ...args] = str.split(" ");
        const command = spawn(cmd, args);

        command.stdout.on("data", data => {
            log(data);
        });

        command.stderr.on("data", data => {
            warn(`Error running command ${str} ${data}`);
            // reject();
        });

        command.on("exit", async code => {
            if (code === 1) {
                warn(`${str} failed: ${data}`);
                rej();
                return;
            }
            res();
        });
    });
}

function init(cwd, args) {
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

        note("Cloning silo-starter...");

        try {
            await run(`git clone --depth=1 ${GIT_REPO_URL} ${cwd}`);
            // Remove .git dir
            console.log(cwd);

            // Check if silo installed

            // note("Creating directories...");
            await fs.move(
                `${cwd}/packages/silo-starter`,
                `${cwd}/silo-starter`
            );

            await del([`${cwd}/*`, `!${cwd}/silo-starter`]);

            const files = glob.sync(`${cwd}/silo-starter/*`);
            files.forEach(file => {
                fs.moveSync(file, file.replace("/silo-starter", ""));
            });

            await del([`${cwd}/silo-starter`, ".git"]);

            ["dist", "schema", "assets", "data"].map(dir =>
                fs.mkdirp(`${cwd}/${dir}`)
            );

            console.log("Finished phase 1");
        } catch (err) {
            console.log(`Install failed, reverting`);
            await del([`${cwd}/*`, ".git", ".gitignore"]);
            return;
        }

        // Generate secrets
        note("Running npm install...");

        try {
            await run("npm install");
        } catch (err) {
            warn(
                "Failed to install dependancies, please run 'npm install' manually"
            );
        }
        // npm install
        log("Silo installed!");
        resolve();
    });
}

module.exports = init;
