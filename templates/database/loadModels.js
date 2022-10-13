`${
  opts.esm
    ? `import { fileURLToPath, pathToFileURL } from 'url';
import path  from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));`
    : `const path = require('path');
const fs = require('fs');
`
}

const loadModels = ${opts.esm ? 'async' : ''} (sequelize, dataTypes) => {
    if (!sequelize) throw new Error('Missing sequelize connection');

    const files = fs
        .readdirSync(path.join(__dirname , '/models'))
        .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js');

  ${
    opts.esm
      ? ` let Models = {};
   await Promise.all(
        files.map(file => {
            return import(pathToFileURL(path.join(__dirname, '/models', file))).then( ({ default: modelFn }) => {
                const model =  modelFn(sequelize, dataTypes);
                Models[model.name]  = model;
            });
        })
    );`
      : `const Models = files.reduce((acc, file) => {
      const model = require(path.join(__dirname, 'models', file))(sequelize, dataTypes);
      acc[model.name] = model;
        return acc;
    }, {});
`
  }

    Object.keys(Models).forEach(key => {
    if ('associate' in Models[key]) {
      Models[key].associate(Models);
    }
  });

  return Models;
};

${opts.esm ? 'export default loadModels;' : 'module.exports = loadModels;'}
`;
