const { isEmptyOrNewDirectory, createFolders, createFiles } = require('../../files');
const { promisify } = require('util');
const { join } = require('path');
const rimraf = promisify(require('rimraf'));
const fs = require('fs').promises;

const directory = join(__dirname, 'test-folder');
const directory2 = join(__dirname, 'test-folder2');

describe('files.js', () => {
  describe('isEmptyOrNewDirectory', () => {
    test('if folder is empty', async () => {
      await fs.mkdir(directory);
      expect(isEmptyOrNewDirectory(directory)).toBe(true);
    });
    test('if folder is not empty', async () => {
      await fs.mkdir(join(directory, 'nested-test'));
      expect(isEmptyOrNewDirectory(directory)).toBe(false);
    });
  });

  describe('createFolders', () => {
    test('if folders are being created', async () => {
      const foldersToCreate = [directory, directory2];
      const folderCreated = await createFolders(foldersToCreate);
      expect(folderCreated.length).toBe(2);
    });
  });
  describe('createFiles', () => {
    test('if a file is created from a template', async () => {
      const file = join(__dirname, 'test.json.js');
      await fs.writeFile(file, '`{"hello":"world"}`');

      const fileCreated = await createFiles({ files: ['test.json.js'], src: __dirname, dest: __dirname });
      expect(fileCreated.length).toBe(1);
    });
  });
});

afterAll(() => {
  return Promise.all([
    rimraf(join(directory)),
    rimraf(join(directory2)),
    rimraf(join(__dirname, 'test.json.js')),
    rimraf(join(__dirname, 'test.json'))
  ]);
});
