const { spawn } = require("child_process");

module.exports = function run(cmdStr, opt = {}) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = cmdStr.split(" ");
    const command = spawn(cmd, args, { stdio: ["inherit"], ...opt });

    command.stdout.on("data", data => {
      // console.log(data);
    });

    command.stderr.on("data", data => {});

    command.on("exit", async code => {
      if (code === 1) {
        console.log(`${cmdStr} failed: ${code}`);
        reject();
        return;
      }
      resolve();
    });
  });
};
