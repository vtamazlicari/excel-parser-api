'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('../src/services/winston/logger');
const cors = require('cors');

const { FeathersError } = require('@feathersjs/errors');

const createProjectsRoute = require('./routes/projects');

module.exports = function getApp(mongoConnection) {
  const app = express();

  const projectsRepository = require('./repositories/projects_repo')(mongoConnection);

  app.use(cors({origin: 'http://localhost:4200'}));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(morgan('combined', { stream: logger.stream }));

  app.use('/api/v1/projects', createProjectsRoute(projectsRepository));

  // eslint-disable-next-line no-unused-vars
  app.use((err, request, response, next) => {
    let error;
    if (err instanceof FeathersError) {
      error = err.toJSON();
    } else {
      logger.error(err);
      error = err;
      error.code = err.code || 500;
      error.message = err.message || 'UNKNOWN_SERVER_ERROR';
    }
    return response.status(error.code).json(error.message);
  });

  return app;
};
