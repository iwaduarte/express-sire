`${opts.esm ? "import SequelizeObject from './connect.js'" : "const { sequelize } = require('./connect');"}

// update database tables (columns and metadata).
// quick alternative to migrations.

const { sequelize } = SequelizeObject;

sequelize
  .sync({
    alter: true,
    logging: true
  })
  .then(status => {
    if (status) console.dir(status.models, { depth: 0 });
  })
  .catch(error => console.log(error));
`;
