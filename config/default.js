'use strict';

module.exports = {
  mongo: process.env.MONGO_URI || 'mongodb://localhost:27017/uploads',
  port: process.env.PORT || 80,
  host: process.env.HOST || '0.0.0.0',
  debug_logger: process.env.DEBUG_LOGGER || false,
  salt: process.env.SALT || 'salt',

  development: {
  },
};
