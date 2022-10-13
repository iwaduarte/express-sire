`${
  opts.esm
    ? `import * as dotenv from 'dotenv';
    dotenv.config();
    import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
${opts.compression ? `import compression from 'compression';` : ``}
${opts.helmet ? `import helmet from 'helmet';` : ``}

import mainRouter from './routes/routes.js';
${opts.sequelize ? "import usersRouter from './routes/users.js';" : ''}
`
    : `require('dotenv').config();
    const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
${opts.compression ? `const compression = require('compression');` : ``}
${opts.helmet ? `const helmet = require('helmet');` : ``}

const mainRouter = require('./routes/routes');
${opts.sequelize ? "const usersRouter = require('./routes/users');" : ''}`
}

const app = express();

app.disable('x-powered-by');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
${opts.compression ? `app.use(compression());` : ``}
${
  opts.helmet
    ? `
// be aware of helmet configurations for you best use case https://helmetjs.github.io/
app.use(helmet());
`
    : ''
}
app.use('/', mainRouter);
${opts.sequelize ? "app.use('/users', usersRouter);" : ''} 
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // only providing detailed error in development
  res.status(err.status || 500);
  return res.json( req.app.get('env') === 'development' ? err : { err: "Ops."} );
});

${opts.esm ? 'export default app;' : 'module.exports = app;'}
`;
