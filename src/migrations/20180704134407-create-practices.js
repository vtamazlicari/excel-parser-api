'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('practices', {
      id: {
        type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
      },
      CL: {
        type: Sequelize.DECIMAL(6,2),
          field: 'cl',
          allowNull: true,
      },
      techDebt: {
        type: Sequelize.DECIMAL(6,2),
          field: 'teach_debt',
          allowNull: true,
      },
      TDinSteer: {
        type: Sequelize.DECIMAL(6,2),
          field: 'td_in_steer',
          allowNull: true,
      },
      codeReview: {
        type: Sequelize.DECIMAL(6,2),
          field: 'code_review',
          allowNull: true
      },
      codingRules: {
        type: Sequelize.DECIMAL(6,2),
          field: 'coding_rules',
          allowNull: true,
      },
      testingProcessInPlace: {
        type: Sequelize.DECIMAL(6,2),
          field: 'testing_process_in_place',
          allowNull: true,
      },
      refactoringPlanned: {
        type: Sequelize.DECIMAL(6,2),
          field: 'refactoring_planned',
          allowNull: true,
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('practices');
  },
};
