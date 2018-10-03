'use strict';

const config = require('config');

const mongoConnector = require('./mongo-connector')(config.mongo);

// eslint-disable-next-line global-require
module.exports = function connectToDBs() {
  return mongoConnector.connect();
};
