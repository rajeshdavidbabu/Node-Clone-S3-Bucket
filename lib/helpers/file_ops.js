// @ts-check

'use strict';

const fs = require('graceful-fs');
const { promisify } = require('util');

const mkdirPromise = promisify(fs.mkdir);

module.exports = () => ({
  createDirectoryAsync(dirPath) {
    return mkdirPromise(dirPath, { recursive: true });
  },

  _getDirPathFromFilePath(filePath) {
    let filePathArr = filePath.split('/');
    filePathArr.pop();
    return filePathArr.join('/');
  },

  getWriteStream(filePath) {
    // extract dir path from file path.
    const dirPath = this._getDirPathFromFilePath(filePath);
    return this.createDirectoryAsync(dirPath)
      .then(() => fs.createWriteStream(filePath, { flags: 'w+' }))
      .catch(error => error);
  }
});
