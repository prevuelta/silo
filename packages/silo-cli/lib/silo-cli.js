'use strict';

const glob = require('glob');
const minimist = require('minimist');
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const commandExistsSync = require('command-exists').sync;
const fs = require('fs');

// const platform = require('os').platform();
// const isWindows = platform.includes('win');
//
function warn(msg) {
    log(msg, chalk.yellow('WARN'));
}

function note(msg) {
    log(chalk.green(msg));
}

function log(msg, type = '') {
    console.log('Silo: %s %s', type || msg, type && msg);
}

function error(err) {
    throw new Error(err);
}

function exit() {
    log('Exiting...');
    process.exit();
}

function entry(cwd, args) {
    cwd = cwd || process.cwd();
    process.title = 'Silo';
    args = args || minimist(process.argv.slice(2));
    // console.log(platform);
    if (!commandExistsSync('git')) {
        warn('Please install git to continue');
        exit();
    }

    const files = fs.readdirSync(cwd);
    if (files.length) {
        warn('Please install in an empty directory');
        exit();
    }

    note('Cloning repository...');

    execSync('git clone https://github.com/prevuelta/silo .; rm -rf .git;', {
        stdio: 'inherit',
    });

    note('Installing modules...');

    note('Creating directories...');
    // , function(err, files) {
    // if (err) {
    // some sort of error
    // } else {
    // if (!files.length) {
    // directory appears to be empty
    // }
    // }
    // });
}

module.exports = entry;
