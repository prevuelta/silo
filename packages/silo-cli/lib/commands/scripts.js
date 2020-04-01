const fs = require("fs-extra");
const { run } = require("../util");
const resolve = require("resolve");
const path = require("path");

const DEFAULT_PORT = 9001;

const SILO_PATH = "node_modules/silo-cms";

function script(cwd, args = {}, script = "dev") {
  const port = args.port || DEFAULT_PORT;
  const dir = args.dir;
  if (dir) {
    cwd = path.resolve(process.cwd(), dir);
  }
  return new Promise((res, reject) => {
    const path = resolve.sync("silo-cms", { basedir: cwd });
    const pathArr = path.split("/");
    pathArr.pop();
    const siloDir = pathArr.join("/");
    const siloPath = `${cwd}/${SILO_PATH}`;
    const siloInstalled = fs.existsSync(siloPath);
    if (siloInstalled) {
      return run(`npm run silo:${script} --if-present --prefix=${siloPath}`, {
        cwd: siloDir,
        env: { ...process.env, SITE_DIR: cwd, PORT: port },
      });
    } else {
      return Promise.reject(`silo-cms package not installed`);
    }
  });
}

module.exports = {
  dev: (cwd, args) => script(cwd, args, "dev"),
  serve: (cwd, args) => script(cwd, args, "prod"),
  devSilo: (cwd, args) => script(cwd, args, "dev-silo"),
  build: (cwd, args) => script(cwd, args, "build"),
  script,
};
