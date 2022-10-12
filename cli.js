const chalk = require('chalk');
const { textSync } = require('figlet');
const { prompt } = require('./cli-questions');
const minimist = require('minimist');

const interactiveCLI = async (introQuestion, questions) => {
  console.log(chalk.green(textSync('Express-Sire', { horizontalLayout: 'full' })));
  const { intro } = await prompt([introQuestion]);
  if (intro === 'No') process.exit(1);

  return prompt(questions);
};

const cli = _args => {
  const args = minimist(_args, {
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

module.exports = { interactiveCLI, cli };
