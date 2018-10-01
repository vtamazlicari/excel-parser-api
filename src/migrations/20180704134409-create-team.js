'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('team', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      rightSkillLevel: {
        type: Sequelize.DECIMAL(6,2),
        field: 'right_skill_level',
        allowNull: true,
      },
      teamMood: {
        type: Sequelize.DECIMAL(6,2),
        field: 'team_mood',
        allowNull: true,
      },
      busFactor: {
        type: Sequelize.DECIMAL(6,2),
        field: 'bus_factor',
        allowNull: true,
      },
      teamOkWithClientBusiness: {
        type: Sequelize.DECIMAL(6,2),
        field: 'team_ok_with_client_business',
        allowNull: true
      },
      teamOkWithProjectTechnology: {
        type: Sequelize.DECIMAL(6,2),
        field: 'team_ok_with_project_technology',
        allowNull: true,
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('team');
  },
};
