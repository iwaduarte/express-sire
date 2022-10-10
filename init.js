const { exec } = require('child_process');

const init = (path = './aaaa') => {
  return new Promise((resolve, reject) => {
    exec(`cd ${path} && git init`, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve(true);
    });
  });
};
return init().then(s => console.log(s));

module.exports = { init };
