'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('projects', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      codeProject: {
        type: Sequelize.STRING,
        field: 'code_project',
        allowNull: false,
        validate: {
          len: [1, 10],
        }
      },
      clientName: {
        type: Sequelize.STRING,
        field: 'client_name',
        allowNull: false,
      },
      projectName: {
        type: Sequelize.STRING,
        field: 'project_name',
        allowNull: false,
      },
      global: {
        type: Sequelize.DECIMAL(4,2),
        field: 'global',
        allowNull: false,
      },
      updateAt: {
        type: Sequelize.DATE,
        field: 'update_at',
        allowNull: false,
      },
      itUpdate: {
        type: Sequelize.STRING,
        field: 'it_update',
        allowNull: false,
      },
      july: {
        type: Sequelize.DECIMAL(4,2),
        field: 'july',
        allowNull: false,
      },
      evolution: {
        type: Sequelize.DECIMAL(2),
        field: 'evolution',
        allowNull: false,
      },
      initialPhaseId: {
        type: Sequelize.INTEGER,
        field: 'initial_phase_id',
        foreignKey: true,
        references: {
          model: 'initialPhase',
          key: 'id',
        },
        allowNull: false
      },
      ongoingId: {
        type: Sequelize.INTEGER,
        field: 'ongoing_id',
        foreignKey: true,
        references: {
          model: 'ongoing',
          key: 'id',
        },
        allowNull: false
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('projects');
  },
};
