// @ts-check

'use strict';

const createLogger = require('./utils/logger');
const fileOps = require('./helpers/file_ops')();

const FilePath = require('./helpers/file_path');
const DataHandler = require('./helpers/data_handler');
const Downloader = require('./helpers/downloader');
const Cloner = require('./helpers/cloner');

const Service = require('./service');
const Storage = require('./storage');

class Handler {
  static create(config) {
    const storage = new Storage(config);
    return new Service(
      {
        filePath: new FilePath(config),
        dataHandler: new DataHandler({ storage }),
        downloader: new Downloader({ storage }),
        cloner: new Cloner({ fileOps })
      },
      createLogger(config)
    );
  }
}

module.exports = Handler;
