export const {promisify} = require('util');
export const readFile = promisify(require('fs').readFile);