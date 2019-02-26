// @ts-check

'use strict';

const TARGET_DIR = `${__dirname}/../../local_S3`;

class FilePath {
  constructor(config) {
    this.awsBucket = config.aws.bucket;
    this.awsRootDirectory = config.aws.rootDirectory; // directory to clone.
  }

  getLocalS3BucketPath() {
    return `${TARGET_DIR}/${this.awsBucket}`;
  }

  getS3BucketRootDirectory() {
    return this.awsRootDirectory || '';
  }

  getLocalS3FilePath(filePath) {
    const bucketPath = this.getLocalS3BucketPath();
    return `${bucketPath}/${filePath}`;
  }

  getLocalS3DirPath(dirPath) {
    const bucketPath = this.getLocalS3BucketPath();
    return `${bucketPath}/${dirPath}`;
  }

  getLocalS3FilePaths(filePaths) {
    return filePaths.map(filePath => this.getLocalS3FilePath(filePath));
  }

  getLocalS3DirPaths(dirPaths) {
    return dirPaths.map(dirPath => this.getLocalS3DirPath(dirPath));
  }
}

module.exports = FilePath;
