const { spawn } = require("child_process");

module.exports = function run(cmdStr, opt = {}) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = cmdStr.split(" ");
    const command = spawn(cmd, args, { stdio: ["inherit"], ...opt });

    command.stdout.on("data", data => {
      log(data);
    });

    command.stderr.on("data", data => {
      warn(`Error running command '${cmdStr}'`);
      warn(data);
      reject();
    });

    command.on("exit", async code => {
      if (code === 1) {
        warn(`${cmdStr} failed: ${code}`);
        reject();
        return;
      }
      resolve();
    });
  });
};
