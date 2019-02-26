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
    }

    /**
     * There are two ways to implement this method for recursion:
     * 1) We force the requests to happen consecutively and break the cycle.
     * 2) We allow them to do a free run. And print errors at the end.
     *
     * Here we are going to follow the 2nd method. And for reference I will add 1st also.
     *
     * In detail:
     * Consecutive execution here means that we await the previous _fetchDirectoryContents
     * to complete before getting to the new one. Concurrent/Parallel is when we fire all
     * the _fetchDirectoryContents at the same time for the current depth, and wait for the them
     * to complete. Consecutive method can be used when you want to break-execution in the event
     * of any error. Concurrent can be used when you want a free-run till the end (or) until a
     * blocking error occurance (or) when input for next function is missing. For concurrent
     * process we might have to wrap the recursion around Promise for tracking the start and end of
     * recurssion because we don't track calls seperately. Concurrent run is faster because we let
     * event loop decide what to process next.
     */

    /**
     * Method 1: //code for consecutive exec.

      for(const directory of containedEntities.directories) {
        try {
          await this._fetchDirectoryContents(directory);
        } catch(error) {
          throw new Error(error)
        }
      }

      */

    /**
     * Method 2: // code for parallel exec under current depth.
     *
     * Recursion to concurrently run all the directory fetch under current depth.
     * Returns promise to keep the recursion from keeping track of start and finish.
     *
     */
    return Promise.all(containedEntities.directories
      .map(directory => this._fetchAndCloneDirectory(directory)));
  }

  // involves file-system cloning and downloading files.
  async _runCloningProcess(containedEntities) {
    const localDirPaths = this.filePath.getLocalS3DirPaths(containedEntities.directories);
    const localFilePaths = this.filePath.getLocalS3FilePaths(containedEntities.files);

    await this.cloner.cloneDirectories(localDirPaths); // clone folders.
    const writeStreams = this.cloner.cloneFiles(localFilePaths); // clone files.

    try {
      await this.downloader.downloadS3Files(containedEntities.files, writeStreams); // download files
    } catch (error) {
      throw error;
    }
  }

  async cloneS3Bucket() {
    try {
      // create a local S3 bucket.
      await this._createLocalS3Bucket();
      // initiate clone from the root directory.
      await this._fetchAndCloneDirectory(this.filePath.getS3BucketRootDirectory());
      // success logs
      this.logger.info({ DOWNLOAD_ERRORS_COUNT }, 'Failed file downloads');
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
