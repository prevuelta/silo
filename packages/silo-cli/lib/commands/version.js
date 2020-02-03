'use strict';

const pkg = require('../../package.json');

function version(args) {
    console.log(process.versions);
    console.log('Silo:', pkg.version);
}

modules.exports = version;
