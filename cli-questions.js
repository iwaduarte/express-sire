const inquirer = require('inquirer');
const { isEmptyOrNewDirectory } = require('./files');

const intro = {
  name: `intro`,
  type: `list`,
  message: `Hello how are you? Let's create our scaffold. Shall we?`,
  choices: ['Yes', 'No'],
  default: 'Yes'
};
const projectName = {
  name: `projectName`,
  type: `input`,
  message: `What is the project name?`,
  default: `app-sire`,
  validate: answer => {
    const ONLY_ALPHANUMERIC_REGEX = /^([a-zA-Z0-9-_]){3,20}$/;
    if (!ONLY_ALPHANUMERIC_REGEX.test(answer))
      return `Please inform a valid project name (only alphanumeric; 3-20 length max)`;
    if (!isEmptyOrNewDirectory(answer))
      return `The directory ${answer} contains files/folders that could conflict. You should provide an empty folder`;
    return true;
  }
};
const monorepo = {
  name: 'monorepo',
  type: 'confirm',
  message: 'Would you like a monorepo? (2 folders will be created (backend and frontend) and frontend will be empty):',
  default: true
};
const moduleSystem = {
  name: `moduleSystem`,
  type: `list`,
  message: `ESM or CJS ?`,
  choices: ['cjs', 'esm'],
  default: 'cjs'
};

const git = {
  name: `git`,
  message: `Would you like Git?`,
  type: `checkbox`,
  choices: [
    { name: 'git', value: true, checked: true },
    { name: '.gitignore', value: true, checked: true }
  ]
};

const compression = {
  name: `compression`,
  message: `(Extra) Would you like to add compression?`,
  type: `confirm`,
  default: true
};
const helmet = {
  name: `helmet`,
  type: `confirm`,
  message: `(Extra) Would you like to add helmet?`,
  default: true
};
const sequelize = {
  name: `sequelize`,
  type: `confirm`,
  message: `(Extra) Would you like to add sequelize with postgres support?`,
  default: true
};

const questions = [intro, projectName, monorepo, moduleSystem, git, compression, helmet, sequelize];

const prompt = async _questions => await inquirer.prompt(_questions);

module.exports = { questions, prompt };
