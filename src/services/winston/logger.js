'use strict';

/* eslint-disable global-require */

const config = require('config');

if (config.debug_logger) {
  module.exports = console;
} else {
  const winston = require('winston');

  const opt = {
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }
  };

  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(opt.console),
    ],
    exitOnError: false,
  });

  logger.stream = {
    // eslint-disable-next-line no-unused-vars
    write(message, encoding) {
      logger.log('info', message);
    },
  };

  module.exports = logger;
}
