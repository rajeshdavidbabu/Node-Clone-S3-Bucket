// @ts-check

'use strict';

class Cloner {
  constructor({ fileOps }) {
    this.fileOps = fileOps;
  }

  _cloneDirectory(dirPath) {
    return this.fileOps.createDirectoryAsync(dirPath);
  }

  _cloneFile(filePath) {
    return this.fileOps.getWriteStream(filePath);
  }

  cloneDirectories(dirPaths) {
    return Promise.all(dirPaths.map(dirPath => this._cloneDirectory(dirPath)));
  }

  cloneFiles(filePaths) {
    return Promise.all(filePaths.map(filePath => this._cloneFile(filePath)));
  }

  cloneS3Bucket(bucketPath) {
    return this.fileOps.createDirectoryAsync(bucketPath);
  }
}

module.exports = Cloner;
