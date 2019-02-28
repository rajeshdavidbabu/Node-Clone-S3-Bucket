// @ts-check

'use strict';

let DOWNLOAD_ERRORS_COUNT = 0;

class Service {
  constructor(deps, logger) {
    this.dataHandler = deps.dataHandler;
    this.downloader = deps.downloader;
    this.filePath = deps.filePath;
    this.cloner = deps.cloner;

    this.logger = logger;
  }

  _createLocalS3Bucket() {
    const bucketPath = this.filePath.getLocalS3BucketPath();
    return this.cloner.cloneS3Bucket(bucketPath);
  }

  // fetch directory contents recursively on each depth.
  async _fetchAndCloneDirectory(rootDirectory) {
    const containedEntities = await this.dataHandler.getContainedEntities(rootDirectory);
    try {
      await this._runCloningProcess(containedEntities);
    } catch (error) {
      DOWNLOAD_ERRORS_COUNT += 1;
      this.logger.error({ error }, 'Error occured during download');
      throw error;
    }
  }

  // involves file-system cloning and downloading files.
  async _runCloningProcess(containedEntities) {
    const localDirPaths = this.filePath.getLocalS3DirPaths(containedEntities.directories);
    const localFilePaths = this.filePath.getLocalS3FilePaths(containedEntities.files);

    await this.cloner.cloneDirectories(localDirPaths); // clone folders.
    const writeStreams = this.cloner.cloneFiles(localFilePaths); // clone files.

    await this.downloader.downloadS3Files(containedEntities.files, writeStreams); // download files async
  }

  async cloneS3Bucket() {
    try {
      // create a local S3 bucket.
      await this._createLocalS3Bucket();
      // initiate clone from the root directory.
      await this._fetchAndCloneDirectory(this.filePath.getS3BucketRootDirectory());
      // success logs
      this.logger.info('Cloning finished successfully !!!');
    } catch (error) {
      // failure logs
      this.logger.info({ DOWNLOAD_ERRORS_COUNT }, 'Failed file downloads');
      this.logger.error({ error }, 'Cloning failed to finish, please try again !!!');
      throw error;
    }
  }
}

module.exports = Service;
