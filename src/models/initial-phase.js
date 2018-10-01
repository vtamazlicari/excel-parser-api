'use strict';

module.exports = function defineInitialPhase(sequelize, DataTypes) {
  const InitialPhase = sequelize.define(
    'initialPhase',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      comercialOffer: {
        type: DataTypes.DECIMAL(6,2),
        field: 'comercial_offer',
        allowNull: true,
      },
      projectLaunchCheckList: {
        type: DataTypes.DECIMAL(6,2),
        field: 'project_launch_check_list',
        allowNull: true,
      },
      kickOffMeetingWithClient: {
        type: DataTypes.DECIMAL(6,2),
        field: 'kick_off_meeting_with_client',
        allowNull: true,
      },
      teamReestimation: {
        type: DataTypes.DECIMAL(6,2),
        field: 'team_reestimation',
        allowNull: true
      },
      teamEvaluatedByDT: {
        type: DataTypes.DECIMAL(6,2),
        field: 'team_evaluate_by_DT',
        allowNull: true,
      },
      smpoEvaluatedByDT: {
        type: DataTypes.DECIMAL(6,2),
        field: 'sm_po_evaluate_by_dt',
        allowNull: true,
      },
      teamWithScrumTraining: {
        type: DataTypes.DECIMAL(6,2),
        field: 'team_with_scrum_training',
        allowNull: true
      },
      guepardInvolvedAtProjectStart: {
        type: DataTypes.DECIMAL(6,2),
        field: 'guepard_involved_at_project_start',
        allowNull: true
      },
      score: {
        type: DataTypes.DECIMAL(6,2),
        field: 'score',
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        field: 'status',
        allowNull: true
      },
    },
    {
      tableName: 'initialPhase',
      timestamps: true,
    },
  );

  // eslint-disable-next-line no-unused-vars
  InitialPhase.associate = function associateInitialPhase(models) {
    InitialPhase.hasMany(models.Projects, { foreignKey: 'initialPhaseId' });
  };

  return InitialPhase;
};
