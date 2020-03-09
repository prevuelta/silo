const fs = require("fs-extra");

const SILO_PATH = "node_modules/@silo/silo-cms";

const { run } = require("../util");

const cwd = process.cwd();
const resolve = require("resolve");

function serve(serveOrDev = "prod") {
  return new Promise((res, reject) => {
    const path = resolve.sync("@silo/silo-cms", { basedir: cwd });
    const pathArr = path.split("/");
    pathArr.pop();
    const siloDir = pathArr.join("/");
    const scriptPath = `${cwd}/${SILO_PATH}/scripts/dev.sh`;
    const scriptExists = fs.existsSync(scriptPath);
    console.log(scriptPath, scriptExists);
    if (scriptExists) {
      return run(`npm run ${serveOrDev}`, { cwd: siloDir });
    } else {
      return Promise.reject(`@silo/silo-cms package not installed`);
    }
  });
}

module.exports = {
  dev: () => serve("dev"),
  serve: () => serve(),
};
