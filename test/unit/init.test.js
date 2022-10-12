const { init } = require('../../init');
const path = require('path');
const { promisify } = require('util');
const { join } = require('path');
const rimraf = promisify(require('rimraf'));

const fs = require('fs').promises;

test('if init creates a .git folder', async () => {
  const directory = path.join(__dirname, 'test-folder');
  await fs.mkdir(directory);
  const gitMessage = await init(directory);
  console.log(gitMessage);
  await rimraf(join(directory));
  expect(gitMessage.substring(0, 32)).toBe(`Initialized empty Git repository`);
});
