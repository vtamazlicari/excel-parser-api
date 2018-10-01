'use strict';

module.exports = function defineProjects(sequelize, DataTypes) {
  const Projects = sequelize.define(
    'projects',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      codeProject: {
        type: DataTypes.STRING,
        field: 'code_project',
        allowNull: false,
        validate: {
          len: [1, 10],
        }
      },
      clientName: {
        type: DataTypes.STRING,
        field: 'client_name',
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      projectName: {
        type: DataTypes.STRING,
        field: 'project_name',
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      global: {
        type: DataTypes.DECIMAL(4,2),
        field: 'global',
        allowNull: false,
      },
      updateAt: {
        type: DataTypes.DATE,
        field: 'update_at',
        allowNull: false
      },
      itUpdate: {
        type: DataTypes.BOOL,
        field: 'update_at',
        allowNull: false,
      },
      july: {
        type: DataTypes.DECIMAL(4,2),
        field: 'july',
        allowNull: false,
      },
      evolution: {
        type: DataTypes.DECIMAL(2),
        field: 'evolution',
        allowNull: false
      },
      initialPhaseId: {
        type: DataTypes.INTEGER,
        field: 'initial_phase_id',
        allowNull: false
      },
      ongoingId: {
        type: DataTypes.INTEGER,
        field: 'ongoing_id',
        allowNull: false
      },
    },
    {
      tableName: 'projects',
      timestamps: true,
    },
  );

  // eslint-disable-next-line no-unused-vars
  Projects.associate = function associateProjects(models) {
    Projects.belongsTo(models.InitialPhase, { foreignKey: 'initialPhaseId' });
    Projects.belongsTo(models.Ongoing, { foreignKey: 'ongoingId' });
  };

  return Projects;
};
