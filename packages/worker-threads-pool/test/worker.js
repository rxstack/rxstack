const path = require('path');

require('ts-node').register();
require(path.resolve(__dirname, './worker.ts'));

process.on('unhandledRejection', (err) => {
  throw err;
});

process.on('uncaughtException', (err) => {
  throw err;
});
