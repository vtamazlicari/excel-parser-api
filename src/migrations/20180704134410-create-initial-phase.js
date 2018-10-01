'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('initialPhase', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      comercialOffer: {
        type: Sequelize.DECIMAL(6,2),
        field: 'comercial_offer',
        allowNull: true,
      },
      projectLaunchCheckList: {
        type: Sequelize.DECIMAL(6,2),
        field: 'project_launch_check_list',
        allowNull: true,
      },
      kickOffMeetingWithClient: {
        type: Sequelize.DECIMAL(6,2),
        field: 'kick_off_meeting_with_client',
        allowNull: true,
      },
      teamReestimation: {
        type: Sequelize.DECIMAL(6,2),
        field: 'team_reestimation',
        allowNull: true
      },
      teamEvaluatedByDT: {
        type: Sequelize.DECIMAL(6,2),
        field: 'team_evaluate_by_DT',
        allowNull: true,
      },
      smpoEvaluatedByDT: {
        type: Sequelize.DECIMAL(6,2),
        field: 'sm_po_evaluate_by_dt',
        allowNull: true,
      },
      teamWithScrumTraining: {
        type: Sequelize.DECIMAL(6,2),
        field: 'team_with_scrum_training',
        allowNull: true
      },
      guepardInvolvedAtProjectStart: {
        type: Sequelize.DECIMAL(6,2),
        field: 'guepard_involved_at_project_start',
        allowNull: true
      },
      score: {
        type: Sequelize.DECIMAL(6,2),
        field: 'score',
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        field: 'status',
        allowNull: true
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('initialPhase');
  },
};
