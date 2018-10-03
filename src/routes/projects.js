'use strict'

const express = require('express');

module.exports = function createProjectsRoute(repository) {
  const router = express.Router();
  const msg = {
    error: {
      notReceived: {
        IdVersion: 'VERSION_ID_NOT_RECEIVED',
        idFile: 'FILE_ID_NOT_RECEIVED',
        mark: 'MARK_NOT_RECEIVED',
        review: 'REVIEW_NOT_RECEIVED',
      },
      notFound: {
        version: 'VERSION_NOT_FOUND',
        file: 'FILE_NOT_FOUND',
        table: 'TABLE_NOT_FOUND'
      },
    },
    success: {
      add: 'ADD_SUCCESS',
      delete: 'DELETED_SUCCESS',
    },
  };
  router
    .route('/')
    .post(create)
    .get(listFiles);

  router
    .route('/:id')
    .get(viewVersions)
    .delete(deleteFile);

  router
    .route('/:id/:id')
    .get(viewModel)
    .delete(deleteVersion);

  async function create(req, res, next) {
    await repository.create(req.body)
      .then(() => {
        res.json({
          success: msg.success.add
        });
        return next();
      })
      .catch(next);
  }

  async function deleteVersion(req, res, next) {
    await repository.deleteVersion(req.params.id)
      .then(() => {
        res.json({
          success: msg.success.delete
        });
        return next();
      })
      .catch(next);
  }

  async function deleteFile(req, res, next) {
    await repository.deleteFile(req.params.id)
      .then(() => {
        res.json({
          success: msg.success.delete
        });
        return next();
      })
      .catch(next);
  }

  async function listFiles(req, res, next) {
    await repository.getFiles()
      .then(data => {
        res.json({data});
        return next();
      })
      .catch(next);
  }

  async function viewVersions(req, res, next) {
    await repository.getVersions(req.params.id)
      .then(data => {
        res.json({data});
        return next();
      })
      .catch(next);
  }

  async function viewModel(req, res, next) {
    await repository.getModel(req.params.id)
      .then(data => {
        res.json({data});
        return next();
      })
      .catch(next);
  }
  return router;
};