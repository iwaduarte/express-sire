`{
  "name": "${projectName}",
  ${esm ? `"type":"module",\n` : ''}"version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www",
    ${sequelize ? `"update-db": "node ./database/syncDatabase",\n` : ''} },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.18.2",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1",
    ${compression ? `"compression":"~1.7.4",\n` : ''} ${helmet ? `"helmet":"~6.0.0",\n` : ''} ${
  sequelize ? `"sequelize":"~6.24.0\n"` : ''
}  },
    "devDependencies": {
    "prettier": "^2.7.1"
  },
}
`;