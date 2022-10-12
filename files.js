const fs = require('fs');
const fsPromises = fs.promises;
const { join } = require('path');
const prettier = require('prettier');

const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);

const isEmptyOrNewDirectory = dirPath => {
  if (fs.existsSync(dirPath)) return fs.readdirSync(dirPath).length === 0;
  return true;
};
const createFolders = (folders = []) =>
  Promise.all(
    folders.map(dirToCreate => dirToCreate && fsPromises.mkdir(dirToCreate, { recursive: true, mode: MODE_0755 }))
  );

// eslint-disable-next-line no-unused-vars
const createFiles = ({ files = [], src = '', dest = '', opts }) =>
  Promise.all(
    files.map(async file => {
      const { fileName, mode = MODE_0666, output, prettify } = typeof file === `string` ? { filename: file } : file;
      const fileTemplate = await fsPromises.readFile(join(src, fileName), 'utf-8');
      const _fileObject = fileName.includes('.js') ? eval(fileTemplate) : fileTemplate;
      const fileObject = prettify ? prettier.format(_fileObject, { filepath: prettify }) : _fileObject;
      const newFileName = output ? output : fileName;

      return fsPromises.writeFile(join(dest, newFileName), fileObject, {
        mode
      });
    })
  );

module.exports = { isEmptyOrNewDirectory, createFolders, createFiles };
