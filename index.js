const fs = require('fs');
const fsPromises = fs.promises;
const { join } = require('path');
const chalk = require('chalk');
const { textSync } = require('figlet');
const { questions, prompt } = require('./cli-questions');
const [introQuestion, ..._questions] = questions;

const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);

const { log } = console;

const start = async () => {
  log(chalk.green(textSync('Express-Sire', { horizontalLayout: 'full' })));
  const { intro } = await prompt([introQuestion]);
  if (intro === 'No') process.exit(1);

  const answers = await prompt(_questions);
  const { projectName, monorepo, moduleSystem, compression, helmet, sequelize } = answers;

  const backendFolder = monorepo ? 'backend' : '';
  const frontendFolder = monorepo ? join(projectName, 'frontend') : '';

  const projectFolders = [
    join(projectName, backendFolder, 'routes'),
    join(projectName, backendFolder, 'controllers'),
    join(projectName, backendFolder, 'bin'),
    sequelize ? join(projectName, backendFolder, 'database', 'models') : null,
    frontendFolder
  ];

  const esm = moduleSystem === 'esm';

  await Promise.all(
    projectFolders.map(
      dirToCreate => dirToCreate && fsPromises.mkdir(dirToCreate, { recursive: true, mode: MODE_0755 })
    )
  );
  const dirLocationFrom = join(__dirname, `template`);
  const dirLocationTo = join(process.cwd(), projectName, backendFolder);

  //missing git (init repository)
  const files = [
    '.env.js',
    'index.js',
    'package.json.js',
    [join('bin', 'www.js'), MODE_0755, true],
    '.gitignore',
    join('routes', 'routes.js'),
    join('routes', 'users.js'),
    ...(sequelize
      ? [
          join('database', 'connect.js'),
          join('database', 'loadModels.js'),
          join('database', 'syncDatabase.js'),
          join('database', `models`, 'User.js')
        ]
      : [])
  ];

  await Promise.all(
    files.map(async fileToCreate => {
      const [fileName, mode, removeJSExt] = Array.isArray(fileToCreate) ? fileToCreate : [fileToCreate, MODE_0666];
      const fileTemplate = await fsPromises.readFile(join(dirLocationFrom, fileName), 'utf-8');
      const fileObject = fileName.includes('.js') ? eval(fileTemplate) : fileTemplate;
      const newFileName = fileName.split('.').length > 2 || removeJSExt ? fileName.replace(/(.js)$/, '') : fileName;

      return fsPromises.writeFile(join(dirLocationTo, newFileName), fileObject, {
        mode
      });
    })
  );

  log(chalk.yellow('All good to go! :'));
};

start();
