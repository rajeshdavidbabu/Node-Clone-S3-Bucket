// @ts-check

'use strict';

const fs = require('graceful-fs');
const { promisify } = require('util');

const mkdirPromise = promisify(fs.mkdir);

module.exports = () => ({
  createDirectoryAsync(dirPath) {
    return mkdirPromise(dirPath, { recursive: true });
  },

  getWriteStream(filePath) {
    return fs.createWriteStream(filePath, { flags: 'w+' });
  }
});
