// @ts-check

'use strict';

// handles storage data and returns the processed data.
class DataHandler {
  constructor({ storage }) {
    this.storage = storage;
  }

  // returns files and directories under the root directory.
  getContainedEntities(rootDirectory) {
    return this.storage.getListAllKeys(rootDirectory)
      .then((containedEntities) => {
        const mappedData = {};
        // actual location are under Keys for files and Prefix for folders.
        mappedData.files = containedEntities.files.map(elem => elem.Key);
        mappedData.directories = containedEntities.directories.map(elem => elem.Prefix);
        return mappedData;
      });
  }
}

module.exports = DataHandler;
