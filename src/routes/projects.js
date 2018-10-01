'use strict'

const express = require('express');
const errors = require('@feathersjs/errors');
const config = require('config');


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
      add: 'TABLE_ADD',
      delete: 'TABLE_DELETED',
    },
  };
  router
    .route('/')
    .post(create)
    .get(list);

  router
    .route('/:id')
    .get(viewVersions);

  router
    .route('/:id/:id')
    .get(viewModel)
    .delete(deleteVersion);

  async function create(req, res, next) {
    await repository.create(req.body)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(error => {
        res.json({

        });
        console.error(error);
      });
  }

  async function deleteVersion(req, res) {
    await repository.deleteVersion(req.params.id)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(404);
      })
  }

  async function list(req, res) {
    await repository.getFiles()
      .then(data => {
        res.send(data);
      })
      .catch(console.error);
  }

  async function viewVersions(req, res) {
    await repository.getVersions(req.params.id)
      .then(data => {
        res.send(data);
      })
      .catch(console.error);
  }

  async function viewModel(req, res) {
    await repository.getModel(req.params.id)
      .then(data => {
        res.send(data);
      })
      .catch(console.error);
  }
  return router;
};