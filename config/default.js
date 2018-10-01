'use strict';

module.exports = {
  mysql: process.env.MYSQL_URI || 'mysql://localhost:3306/parser',
  mongo: process.env.MONGO_URI || 'mongodb://localhost:27017/uploads',
  port: process.env.PORT || 80,
  host: process.env.HOST || '0.0.0.0',
  debug_logger: process.env.DEBUG_LOGGER || false,
  salt: process.env.SALT || 'salt',

  development: {
    username: process.env.SEQUELIZE_USER || 'root',
    password: process.env.SEQUELIZE_PASSWORD || 'pass',
    database: process.env.SEQUELIZE_DB || 'db',
    host: process.env.SEQUELIZE_HOST || 'localhost',
    dialect: process.env.SEQUELIZE_DIALECT || 'mysql',
  },
};
