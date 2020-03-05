const fs = require("fs");
const resolve = require("resolve");

function serve() {
    const siloPath = resolve.sync("@silo/silo-cms", { basedir: process.cwd() });
    // const siloPath = resolve.sync("@silo/silo-cms");
    console.log("Silo path", siloPath);
    return Promise.resolve("Serve");
}

module.exports = serve;
