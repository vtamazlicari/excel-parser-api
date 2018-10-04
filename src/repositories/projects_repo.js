const mongoose = require('mongoose');
const assert = require('assert');
const randomstring = require("randomstring");
const errors = require('@feathersjs/errors');

mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const thingSchema = new mongoose.Schema({
  code: String,
  clientName: String,
  ProjectName: String,
  InitialPhase: Object

}, {strict: false, autoIndex: false});

const fileSchema = Schema({
  name: String,
  versions: [{type: Schema.Types.ObjectId, ref: 'Version'}]
}, {strict: false, autoIndex: false});

const versionSchema = Schema({
  name: String,
  tableName: String,
  table: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'models'
  }]
}, {strict: false, autoIndex: false});

module.exports = function createProjectsRepository(mongoConnection) {
  const Version = mongoConnection.model('Version', versionSchema);
  const File = mongoConnection.model('File', fileSchema);

  async function create(project) {
    const name = randomstring.generate();
    const model = mongoConnection.model(name, thingSchema);

    return new Promise((resolve, reject) => {
      fileExists(project.file, project.version, project.data, model)
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  function createTable(model, dataTable) {
    return new Promise((resolve, reject) => {
      model.collection.insertMany(dataTable, (error, res) => {
        if (error) reject(error);
        assert.equal(null, error);
        assert.equal(dataTable.length, res.insertedCount);
        resolve(res);
      });
    });
  }

  function createVersion(versionName, version) {
    return new Promise((resolve, reject) => {
      version.save(error => {
        if (error) reject(error);
        else resolve(version);
      });
    })
  }

  function createFile(file) {
    return new Promise((resolve, reject) => {
      file.save((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  function addVersionInFile(versionId, data) {
    return new Promise((resolve, reject) => {
      data.versions.push(versionId);
      data.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  function fileExists(fileName, versionName, dataTable, model) {
    return new Promise((resolve, reject) => {
      createTable(model, dataTable)
        .then(res => {
          const filter = res.ops.map(items => items._id);
          const version = new Version({
            name: versionName,
            tableName: model.collection.collectionName,
            table: filter
          });
          createVersion(versionName, version)
            .then(res => {
              const versionId = res._id;
              File.findOne({name: fileName})
                .then((res) => {
                  if (res) {
                    addVersionInFile(versionId, res)
                      .then(() => {
                        resolve();
                      })
                      .catch(error => {
                        reject(error);
                      });
                  } else {
                    const file = new File({
                      name: fileName,
                      versions: [versionId]
                    });
                    createFile(file)
                      .then(() => {
                        resolve();
                      })
                      .catch(error => {
                        reject(error);
                      });
                  }
                })
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  async function getFiles() {
      return new Promise((resolve, reject) => {
        File.find({})
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
  }

  async function getVersionsId(id) {
    return new Promise((resolve, reject) => {
      File.findById(id)
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        })
    })
  }

  async function getVersions(idFile) {
    let versionByFile = [];
    return new Promise((resolve, reject) => {
      getVersionsId(idFile)
        .then(versionsFile => {
          return versionsFile.versions.forEach((element, index) => {
            Version.findById(element)
              .then(data => {
                versionByFile[index] = data;
                if (index === versionsFile.versions.length - 1) resolve(versionByFile);
              });
          });
        })
        .catch(() => {
          reject(new errors.NotFound('FILE_NOT_FOUND'));
        });
    });
  }

  async function getModel(idVersion) {
    return new Promise((resolve, reject) => {
      Version.findById(idVersion)
        .then(data => {
          const Model = mongoConnection.model(data.tableName, thingSchema);
          Model.find({})
            .then(modelData => {
              resolve(modelData);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(new errors.NotFound('VERSION_NOT_FOUND'));
        });
    });
  }

  function deleteFile(idFile) {
    return new Promise((resolve, reject) => {
      File.findOneAndDelete({_id: idFile})
        .then(file => {
          file.versions.forEach((version, index) => {
            Version.findOneAndDelete({_id: version._id})
              .then(response => {
                deleteCollection(response.tableName)
                  .catch(error => {
                    reject(error);
                  });
              })
              .catch(error => {
                reject(error);
              });
            if (index === file.versions.length - 1) resolve(file);
          });
        })
        .catch(() => {
          reject(new errors.NotFound('FILE_NOT_FOUND'));
        })
    });
  }

  function deleteVersion(idVersion) {
    return new Promise((resolve, reject) => {
      Version.findOneAndDelete({_id: idVersion})
        .then(version => {
          File.findOneAndUpdate({versions: {$in: [version._id]}}, {$pull: {versions: version._id}})
            .then(() => {
              deleteCollection(version.tableName)
                .then(response => {
                  resolve(response);
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(err => {
              reject(err);
            })
        })
        .catch(() => {
          reject(new errors.NotFound('VERSION_NOT_FOUND'));
        });
    });
  }

  function deleteCollection(collectionName) {
    return new Promise((resolve, reject) => {
      mongoConnection.db.listCollections({name: collectionName})
        .next((err, info) => {
          if (err) {
            reject(err);
          }
          if (info) {
            mongoConnection.collection(info.name)
              .drop((err, success) => {
                if (err) reject(err);
                if (success) resolve(success);
              });
          }
        });
    });
  }

  return {
    create,
    getFiles,
    getVersions,
    getModel,
    deleteVersion,
    deleteFile
  };
};