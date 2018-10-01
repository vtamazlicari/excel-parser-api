const mongoose = require('mongoose');
const mongoXlsx = require('mongo-xlsx');
const excelToJson = require('convert-excel-to-json');
const assert = require('assert');
const randomstring = require("randomstring");
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

const data =
[{
	"code": "PNST01",
	"clientName": "project 1",
	"projectName": "project name 1",
	"initialPhase": {
		"comercialOffer": "",
		"projectLaunchCheckList": "",
		"kickOffMeetingWithClient": "",
		"teamReestimation": "",
		"teamEvaluatedByDT": "",
		"smPoEvaluatedByDT": "",
		"teamWithScrumTraining": "",
		"guepardInvolvedAtProjectStart": ""
	},
	"score1": "NA",
	"status1": "NA",
	"ongoing": {
		"team": {
			"rightSkillLevel": 1,
			"teamMoodMeanVal": 0.7,
			"busFactor": 0.5,
			"teamOkWithClientsBusiness": 1,
			"teamOkWithProjectsTechnology": 0.8
		},
		"customer": {
			"clientOpenForNew": 1,
			"noPressureOnTheProject": 1,
			"goodClientManagement": 0.75
		},
		"practices": {
			"ci": 0,
			"techDebt": 1,
			"tdInSteer": 1,
			"codeReview": 0.75,
			"codingRules": 1,
			"testingProcessInPlace": 1,
			"refactoringPlanned": 0.75
		}
	},
	"score2": 81.66666666666667,
	"status2": 81.66666666666667,
	"global": 0.8166666666666668,
	"updatedAt": "2018-08-26T20:59:36.000Z",
	"isUpdate": 35.38035266203951,
	"perMonth": 0.8,
	"evolution": 0.01666666666666672
}, {
	"code": "PNST01",
	"clientName": "project 1",
	"projectName": "project name 1",
	"initialPhase": {
		"comercialOffer": "",
		"projectLaunchCheckList": "",
		"kickOffMeetingWithClient": "",
		"teamReestimation": "",
		"teamEvaluatedByDT": "",
		"smPoEvaluatedByDT": "",
		"teamWithScrumTraining": "",
		"guepardInvolvedAtProjectStart": ""
	},
	"score1": "NA",
	"status1": "NA",
	"ongoing": {
		"team": {
			"rightSkillLevel": 1,
			"teamMoodMeanVal": 0.7,
			"busFactor": 0.5,
			"teamOkWithClientsBusiness": 1,
			"teamOkWithProjectsTechnology": 0.8
		},
		"customer": {
			"clientOpenForNew": 1,
			"noPressureOnTheProject": 1,
			"goodClientManagement": 0.75
		},
		"practices": {
			"ci": 0,
			"techDebt": 1,
			"tdInSteer": 1,
			"codeReview": 0.75,
			"codingRules": 1,
			"testingProcessInPlace": 1,
			"refactoringPlanned": 0.75
		}
	},
	"score2": 81.66666666666667,
	"status2": 81.66666666666667,
	"global": 0.8166666666666668,
	"updatedAt": "2018-08-26T20:59:36.000Z",
	"isUpdate": 35.38035266203951,
	"perMonth": 0.8,
	"evolution": 0.01666666666666672
}];

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

  function deleteFile(idFile) {
    return new Promise((resolve, reject) => {
      File.findOneAndDelete({_id: idFile})
        .then(file => {
          file.version.forEach((version, index) => {
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
            if (index === file.version.length - 1) resolve(file);
          });
        })
        .catch(error => {
          reject(error);
        })
    });
  }

  function deleteVersion(id) {
    return new Promise((resolve, reject) => {
      Version.findOneAndDelete({_id: id})
        .then(version => {
          File.findOneAndUpdate({version: {$in: [version._id]}}, {$pull: {version: version._id}})
            .then(response => {
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
        .catch(err => {
          reject(err);
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
    deleteVersion,
    deleteFile
  };
};