const mongoose = require('mongoose');
const mongoXlsx = require('mongo-xlsx');
const excelToJson = require('convert-excel-to-json');
const assert = require('assert');
const randomstring = require("randomstring");

const Schema = mongoose.Schema;

const thingSchema = new mongoose.Schema({
  code: String,
  clientName: String,
  ProjectName: String,
  InitialPhase: Object

}, {strict: false, autoIndex: false});

const fileSchema = Schema({
  name: String,
  version: [{type: Schema.Types.ObjectId, ref: 'Version'}]
}, {strict: false, autoIndex: false});

const versionSchema = Schema({
  name: String,
  tableName: String,
  version: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'models'
  }]
}, {strict: false, autoIndex: false});

const data = [
  {
    code: 'QWERT',
    clientName: 'project1',
    projectName: 'project name 1',
    initialPhase: {
      comercialOffer: '1',
      projectLaunchCheckList: '0.23',
      kickOffMeetingWithClient: '0.1'
    }
  },
  {
    code: 'FSGDF',
    clientName: 'project2',
    projectName: 'project name 2',
    initialPhase: {
      comercialOffer: '0.67',
      projectLaunchCheckList: '0.45',
      kickOffMeetingWithClient: '0.13'
    }
  },
  {
    code: 'SDFGFD',
    clientName: 'project3',
    projectName: 'project name 3',
    initialPhase: {
      comercialOffer: '0.23',
      projectLaunchCheckList: '0.65',
      kickOffMeetingWithClient: '0.12'
    }
  }
];

module.exports = function createProjectsRepository(mongoConnection) {
  const Version = mongoConnection.model('Version', versionSchema);
  const File = mongoConnection.model('File', fileSchema);

  async function create(project) {
    console.log(project);
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

  function createDataFileCollection(model, dataTable) {
    return new Promise((resolve, reject) => {
      model.collection.insertMany(dataTable, (error, res) => {
        if (error) reject(error);
        assert.equal(null, error);
        assert.equal(data.length, res.insertedCount);
        resolve(res);
      });
    });
  }

  function createVersionCollection(versionName, version) {
    return new Promise((resolve, reject) => {
      version.save(error => {
        if (error) reject(error);
        else resolve(version);
      });
    })
  }

  function createFileCollection(file) {
    return new Promise((resolve, reject) => {
      file.save((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  function updateVersionInFileCollection(version, data) {
    return new Promise((resolve, reject) => {
      data.version.push(version);
      data.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  function fileExists(fileName, versionName, dataTable, model) {
    return new Promise((resolve, reject) => {
      createDataFileCollection(model, dataTable)
        .then(res => {
          const filter = res.ops.map(items => items._id);
          const version = new Version({
            name: versionName,
            tableName: model.collection.collectionName,
            version: filter
          });
          createVersionCollection(versionName, version)
            .then(res => {
              const versionId = res._id;
              File.findOne({name: fileName})
                .then((res) => {
                  if (res) {
                    updateVersionInFileCollection(versionId, res)
                      .then(() => {
                        resolve();
                      })
                      .catch(error => {
                        reject(error);
                      });
                  } else {
                    const file = new File({
                      name: fileName,
                      version: [versionId]
                    });
                    createFileCollection(file)
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

  async function getVersions(id) {
    let versionByFile = [];
    return new Promise((resolve, reject) => {
      getVersionsId(id)
        .then(versionsFile => {
          return versionsFile.version.forEach((element, index, array) => {
            Version.findById(element)
              .then(data => {
                versionByFile[index] = data;
                if (index === versionsFile.version.length - 1) resolve(versionByFile);
              });
          });
        })
        .catch(error => {
          reject(error);
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
          reject(error);
        });
    });
  }

  function deleteVersion(id) {
    return new Promise((resolve, reject) => {
      // File.update({version: id}, {$pullAll: {version: [id]}})
      //   .then(() => {
      //     resolve();
      //     Version.save();
      //   })
      //   .catch(error => {
      //     reject(error);
      //   });
      Version.findOneAndRemove({_id: id})
        .then(response => {
          console.log(response);
          File.findOneAndUpdate({_id: {$in: '5bb1d9224b65430bb8b2dad3'}}, {$pull: {versions: response._id}})
            .then(response => {
              console.log(response);
            })
            .catch(err => {
              console.error(err);
            })
        })
        .catch(err => {
          console.error(err);
        });
      Version.save();
      resolve();
    });
  }

  function deleteCollection(collectionName) {
    mongoConnection.db.listCollections({name: collectionName})
      .next((err, info) => {
        if (err) {
          return;
        }
        if (info) {
          console.log(info);
          mongoConnection.collection(info.name)
            .drop((err, success) => {
              if (err) throw err;
              if (success) console.log('collection delete');
            });
        }
      });
  }

  async function generateNameForModel() {
    const name = await randomstring.generate();

    return new Promise((resolve, reject) => {
      mongoConnection.db.listCollections({name: name})
        .next((err, info) => {
          if (err) {
            reject(err);
          }
          if (info == null) {
            resolve(name);
          }
        });
    });
  }

  return {
    create,
    getFiles,
    getVersions,
    getModel,
    deleteVersion
  };
};