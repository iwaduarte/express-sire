#!/usr/bin/env node

const { join } = require('path');
const chalk = require('chalk');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));
const { questions } = require('../cli-questions');
const git = require('../init');
const { cli, interactiveCLI } = require('../cli');
const { createFolders, createFiles } = require('../files');

const [introQuestion, ..._questions] = questions;
const MODE_0755 = parseInt('0755', 8);

const { log } = console;

const rollback = { projectName: '' };

process.on('SIGINT', () => rollbackFn(rollback.projectName));

process.on('uncaughtException', () => rollbackFn(rollback.projectName));

const start = async () => {
  const {
    projectName,
    monorepo,
    moduleSystem,
    compression,
    helmet,
    sequelize,
    git: gitOpts
  } = cli(process.argv.slice(2)) || (await interactiveCLI(introQuestion, _questions)) || {};

  rollback.projectName = projectName;

  const backendFolder = monorepo ? 'backend' : '';
  const frontendFolder = monorepo ? join(projectName, 'frontend') : '';
  const dirLocationFrom = join(__dirname.replace('bin', ''), `templates`);
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
    { filename: 'env.js', output: '.env' },
    { filename: 'app.js', prettify: 'app.js' },
    { filename: 'package.json.js', prettify: 'package.json', output: 'package.json' },
    { filename: join('bin', 'www.js'), mode: MODE_0755, output: join('bin', 'www.js') },
    ...(gitIgnore ? [{ filename: 'gitignore', output: '.gitignore' }] : []),
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
    Running instructions: 
        1 - cd <project-name>${backendFolder && `/${backendFolder}`} 
        2 - npm install
        3 - npm start
  ##############################################
  `)
  );
};

const rollbackFn = (path = '') => {
  if (path) return rimraf(join(process.cwd(), path));
};

start().catch(async err => {
  const { projectName } = rollback;
  console.log(err);
  await rollbackFn(projectName);
  process.exit(1);
});
