// @ts-check

'use strict';

const AWS = require('aws-sdk');

class Storage {
  constructor(config) {
    this.s3 = new AWS.S3({
      accessKeyId: config.aws.access_key_id,
      secretAccessKey: config.aws.secret_access_key,
      region: config.aws.region,
    });
    this.bucket = config.aws.bucket;
  }

  getListAllKeys(rootDirectory) {
    const containedEntities = {
      files: [],
      directories: []
    };
    const params = {
      Bucket: this.bucket,
      Prefix: rootDirectory
    };

    return new Promise((resolve, reject) => this._listAllKeys(
      resolve,
      reject,
      params,
      containedEntities
    ));
  }

  // Contents contain file prefixes and CommonPrefixes contain directories.
  _listAllKeys(resolve, reject, params, containedEntities) {
    this.s3.listObjectsV2(params).promise()
      .then(({
        Contents, IsTruncated, NextContinuationToken,
      }) => {
        // filter files and directories
        Contents.forEach((item) => {
          containedEntities[item.Key.endsWith('/') ? 'directories':'files'].push(item);
        });
        // fetch further info if response is truncated
        if (IsTruncated) {
          this._listAllKeys(
            resolve,
            reject,
            Object.assign(params, { ContinuationToken: NextContinuationToken }),
            containedEntities
          );
        } else {
          resolve(containedEntities);
        }
      })
      .catch(reject);
  }

  downloadObjectFromS3(key, writeStream) {
    return new Promise((resolve, reject) => {
      this.s3
        .getObject({
          Bucket: this.bucket,
          Key: key,
        })
        .createReadStream()
        .on('end', () => resolve())
        .on('error', error => reject(error))
        .pipe(writeStream);
    });
  }
}

module.exports = Storage;
