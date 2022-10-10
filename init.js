const { exec } = require('child_process');

const init = (path = '') => {
  return new Promise((resolve, reject) => {
    exec(`cd ${path} && git init`, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve(stdout);
    });
  });
};

module.exports = { init };
