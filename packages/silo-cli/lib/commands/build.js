const fs = require("fs-extra");
const resolve = require("resolve");
const { run } = require("../util");

const SILO_PATH = "node_modules/@silo/silo-cms";
const cwd = process.cwd();

module.exports = function() {
  return new Promise((res, reject) => {
    const path = resolve.sync("@silo/silo-cms", { basedir: cwd });
    const pathArr = path.split("/");
    pathArr.pop();
    const siloDir = pathArr.join("/");
    const scriptPath = `${cwd}/${SILO_PATH}/scripts/build-site.js`;
    const scriptExists = fs.existsSync(scriptPath);
    if (scriptExists) {
      return run(`npm run build-site`, {
        cwd: siloDir,
        env: { ...process.env, SITE_DIR: cwd }
      });
    } else {
      return Promise.reject(`@silo/silo-cms package not installed`);
    }
  });
};
