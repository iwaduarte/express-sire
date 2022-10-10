const fs = require('fs');
const path = require('path');

const isEmptyOrNewDirectory = dirPath => {
  const _dirPath = path.join(process.cwd(), dirPath);
  if (fs.existsSync(_dirPath)) return fs.readdirSync(_dirPath).length === 0;
  return true;
};

module.exports = { isEmptyOrNewDirectory };
