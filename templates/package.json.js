`{
  "name": "${opts.projectName}",
  ${opts.esm ? `"type":"module",` : ''}
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www",
    ${opts.sequelize ? `"update-db": "node ./database/syncDatabase"\n` : ''} },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.18.2",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1",
    "dotenv": "16.0.3",
    ${opts.compression ? `"compression":"~1.7.4",` : ''}
    ${opts.helmet ? `"helmet":"~6.0.0",` : ''}
    ${opts.sequelize ? `"sequelize":"~6.33.0",\n"pg-hstore": "2.3.4",\n"pg":"8.8.0",\n"bcrypt":"5.1.0"` : ''}  },
    "devDependencies": {
    "prettier": "^2.7.1",
    "nodemon": "2.0.20" 
  }
}
`;
