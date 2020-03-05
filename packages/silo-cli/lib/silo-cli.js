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

function loadModule(path, args) {
    return Promise.try(() => {
        const modulePath = resolve.sync("silo", { basedir: path });
        console.log(modulePath);
        // const Silo = require(modulePath);
    });
}

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
        log("\n  Usage: silo <comand>");
        log("\n  Commands:");
        log("\n    init");
        log("    dev");
        log("    resources\tLists schema");
        log("    create-user");
        exit();
    }

    // Check if package is installed
    //

    // function loadModule(path) {
    //     return Promise.try(() => {
    //         const modulePath = resolve.sync("silo-cms", { basedir: path });
    //         const Silo = require(modulePath);
    //         return Silo;
    //     });
    // }
    //     try {
    //         const module = await loadModule(cwd);
    //     } catch (err) {
    //         warn(`→ Local silo not found in ${chalk.magenta(cwd)}`);
    //         log(`Try running: 'npm install silo-cms --save'`);
    //         exit();
    // }

    commands[cmd](cwd, args)
        .then(() => {
            log(`${cmd.toUpperCase()} successful`);
            exit();
        })
        .catch(err => {
            warn(`${cmd} failed ${err}`);
            exit();
        });
}

module.exports = entry;
