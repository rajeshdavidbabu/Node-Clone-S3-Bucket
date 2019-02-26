// @ts-check

'use strict';

const bunyan = require('bunyan');

module.exports = function createLogger(config) {
  return bunyan.createLogger({
    name: config.application_name,
    level: config.log_level,
  });
};
