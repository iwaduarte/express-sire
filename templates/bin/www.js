`#!/usr/bin/env node

${
  opts.esm || ''
    ? `import dotenv from "dotenv";
dotenv.config();
import app from '../app.js';
import debugFactory from 'debug';
import http from 'http'; 
`
    : `require('dotenv').config();
const app = require('../app');
const debugFactory = require('debug')
const http = require('http');
    `
}

const { DEBUG } = process.env;
debugFactory.enable(DEBUG);
const debug= debugFactory('${opts.projectName}:server');

/** Normalize a port into a number, string, or false. */
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (!isNaN(port) && port>=0)
        return port;

    return false;
}

/** Get port from environment and store in Express. */
const port = normalizePort(process.env.PORT) || 3000;

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
};


/**
 * Get port from environment and store in Express.
 */
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
`;
