'use strict';

const pkg = require('../../package.json');

function version(args) {
    console.log(`v${pkg.version}`);
}

module.exports = version;
