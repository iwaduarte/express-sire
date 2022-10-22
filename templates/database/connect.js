`${
  opts.esm
    ? `import Sequelize from 'sequelize';
import loadModels from './loadModels.js';
import dotenv from "dotenv";
dotenv.config();
`
    : `const Sequelize = require('sequelize');
const loadModels = require('./loadModels');
require('dotenv').config();
`
}  
const { DataTypes } = Sequelize;

// you need to set DATABASE credentials inside your .env file
const { DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_DIALECT = "postgres" } = process.env;

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  dialect: DATABASE_DIALECT,
  minifyAliases: true,
  benchmark: true,
// in production, you would want to set this to false
  logging: console.log
});

const models = ${opts.esm ? 'await' : ''} loadModels(sequelize, DataTypes);

${opts.esm ? 'export default { sequelize, models };' : 'module.exports = { sequelize, models }'}
`;
