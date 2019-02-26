// @ts-check

'use strict';

class Downloader {
  constructor({ storage }) {
    this.storage = storage;
  }

  // downloads the S3 files to a local file.
  _downloadS3File(key, writeStream) {
    return this.storage.downloadObjectFromS3(key, writeStream);
  }

  downloadS3Files(keys, writeStreams) {
    return Promise.all(keys.map((key, i) => this._downloadS3File(key, writeStreams[i])));
  }
}

module.exports = Downloader;
