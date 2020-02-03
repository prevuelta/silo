'use strict';

const glob = require('glob');
const minimist = require('minimist');
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const commandExistsSync = require('command-exists').sync;
const fs = require('fs');

const commands = {
    version: require('./commands/version'),
};

// const platform = require('os').platform();
// const isWindows = platform.includes('win');
//
//

function warn(msg) {
    log(chalk.red(msg));
}

function note(msg) {
    log(chalk.green(msg));
}

function log(msg, type = '') {
    console.log('%s %s', type || msg, type && msg);
}

function error(err) {
    throw new Error(err);
}

function exit() {
    process.exit();
}

function entry(cwd, args) {
    cwd = cwd || process.cwd();
    process.title = 'Silo';
    args = args || minimist(process.argv.slice(2));

    let cmd = '';

    if (args.version || args.v) {
        cmd = 'version';
    } else {
        cmd = args._.shift();
    }

    if (!cmd) {
        exit();
    }

    if (!commands[cmd]) {
        warn(`Unknown command "${cmd}"`);
        log('\n  Usage: silo <comand>');
        log('\n  Commands:');
        log('\n    init');
        log('    dev');
        log('    resources\tLists schema');
        log('    create-user');
        exit();
    }

    commands[cmd]();

    exit();

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

    // execSync('git clone https://github.com/prevuelta/silo .; rm -rf .git;', {
    //     stdio: 'inherit',
    // });

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
