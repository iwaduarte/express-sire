`${
  esm
    ? `import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
${compression ? `import compression from 'compression';\n` : ``} ${helmet ? `import helmet from 'helmet';\n` : ``}
`
    : `const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
${compression ? `const compression = require('compression');\n` : ``} ${
        helmet ? `const helmet = require('helmet');\n` : ``
      }`
} const mainRouter = require('./routes/routes');
const usersRouter = require('./routes/users');

const app = express();

app.disable('x-powered-by');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
${compression ? `app.use(compression());\n` : ``} ${
  helmet
    ? `
// be aware of helmet configurations for you best use case https://helmetjs.github.io/
app.use(helmet());\n
`
    : ''
} app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.status(err.status || 500);
  return res.json(  req.app.get('env') === 'development' ? err : { err: "Ops."} );
});

${esm ? 'export default app;' : 'module.exports = app;'}
`;