// @ts-check

'use strict';

const config = require('./config');
const Handler = require('./lib/handler');

const service = Handler.create(config);
service.cloneS3Bucket()
  .then(() => {})
  .catch(error => error);
