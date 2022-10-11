const fs = require('fs');
const fsPromises = fs.promises;
const { join } = require('path');
const chalk = require('chalk');
const minimist = require('minimist');
const { textSync } = require('figlet');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));
const { questions, prompt } = require('./cli-questions');
const git = require('./init');
const prettier = require('prettier');
const [introQuestion, ..._questions] = questions;

const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);

const { log } = console;

const rollback = { projectName: '' };

process.on('SIGINT', () => rollbackFn(rollback.projectName));

process.on('uncaughtException', () => rollbackFn(rollback.projectName));

const createFolders = (folders = []) =>
  Promise.all(
    folders.map(dirToCreate => dirToCreate && fsPromises.mkdir(dirToCreate, { recursive: true, mode: MODE_0755 }))
  );

// eslint-disable-next-line no-unused-vars
const createFiles = ({ files = [], src = '', dest = '', opts }) =>
  Promise.all(
    files.map(async fileToCreate => {
      const [fileName, mode, removeJSExt, prettify] = Array.isArray(fileToCreate)
        ? fileToCreate
        : [fileToCreate, MODE_0666];
      const fileTemplate = await fsPromises.readFile(join(src, fileName), 'utf-8');
      const _fileObject = fileName.includes('.js') ? eval(fileTemplate) : fileTemplate;
      const fileObject = prettify ? prettier.format(_fileObject, { filepath: prettify }) : _fileObject;
      const newFileName = fileName.split('.').length > 2 || removeJSExt ? fileName.replace(/(.js)$/, '') : fileName;

      return fsPromises.writeFile(join(dest, newFileName), fileObject, {
        mode
      });
    })
  );

const cli = async () => {
  log(chalk.green(textSync('Express-Sire', { horizontalLayout: 'full' })));
  const { intro } = await prompt([introQuestion]);
  if (intro === 'No') process.exit(1);

  return prompt(_questions);
};

const parseArgs = () => {
  const args = minimist(process.argv.slice(2), {
    alias: {
      a: 'all',
      n: 'name',
      mn: 'monorepo',
      ms: 'modsystem',
      gi: 'gitignore',
      gf: 'gitfolder',
      c: 'compression',
      h: 'helmet',
      s: 'sequelize'
    },
    string: ['name', 'modsystem']
  });

  const {
    all,
    name: projectName,
    monorepo = false,
    modsystem: moduleSystem,
    gitignore = false,
    gitfolder = false,
    compression = false,
    helmet = false,
    sequelize = false
  } = args;
  console.log(args);
  if (!(projectName && projectName.trim())) return false;
  if (all)
    return {
      projectName,
      monorepo: true,
      moduleSystem: moduleSystem || 'cjs',
      compression: true,
      helmet: true,
      sequelize: true,
      git: [true, true]
    };

  return {
    projectName,
    monorepo,
    moduleSystem: moduleSystem || 'cjs',
    compression,
    helmet,
    sequelize,
    git: [gitignore, gitfolder]
  };
};

const start = async () => {
  const {
    projectName,
    monorepo,
    moduleSystem,
    compression,
    helmet,
    sequelize,
    git: gitOpts
  } = parseArgs() || (await cli()) || {};

  rollback.projectName = projectName;

  const backendFolder = monorepo ? 'backend' : '';
  const frontendFolder = monorepo ? join(projectName, 'frontend') : '';
  const dirLocationFrom = join(__dirname, `template`);
  const dirLocationTo = join(process.cwd(), projectName, backendFolder);
  const projectFolders = [
    join(projectName, backendFolder, 'routes'),
    join(projectName, backendFolder, 'bin'),
    ...(sequelize
      ? [join(projectName, backendFolder, 'database', 'models'), join(projectName, backendFolder, 'controllers')]
      : []),
    frontendFolder
  ];
  const [gitInit, gitIgnore] = gitOpts;
  const files = [
    '.env.js',
    ['app.js', MODE_0666, false, 'app.js'],
    ['package.json.js', MODE_0666, false, 'package.json'],
    // 'package.json.js',
    [join('bin', 'www.js'), MODE_0755, true],
    ...(gitIgnore ? ['.gitignore'] : []),
    join('routes', 'routes.js'),
    ...(sequelize
      ? [
          join('routes', 'users.js'),
          join('database', 'connect.js'),
          join('database', 'loadModels.js'),
          join('database', 'syncDatabase.js'),
          join('database', `models`, 'User.js'),
          join('controllers', 'user.js')
        ]
      : [])
  ];

  const opts = {
    projectName,
    esm: moduleSystem === 'esm',
    sequelize,
    compression,
    helmet
  };

  await createFolders(projectFolders).then(() => log(chalk.blue(`\n Folders created!`)));
  await createFiles({ files, src: dirLocationFrom, dest: dirLocationTo, opts }).then(() =>
    log(chalk.blue(` Files created!`))
  );
  if (gitInit) {
    await git.init(dirLocationTo).then(message => {
      log(chalk.blue(` ${message.substring(0, 32)}!`));
    });
  }

  log(
    chalk.yellow(`
  ##############################################
    \\o/ All good to go! 
    To run: 
        1 - npm install
        2 - npm start
  ##############################################
  `)
  );
};

const rollbackFn = (path = '') => {
  if (path) return rimraf(join(process.cwd(), path));
};

return start().catch(async err => {
  const { projectName } = rollback;
  console.log(err);
  await rollbackFn(projectName);
  process.exit(1);
});
