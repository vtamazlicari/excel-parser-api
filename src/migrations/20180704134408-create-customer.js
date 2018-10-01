'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('customer', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      clientOpenerForNew: {
        type: Sequelize.DECIMAL(6,2),
        field: 'client_opener_for_new',
        allowNull: true,
      },
      noPressureOnTheProject: {
        type: Sequelize.DECIMAL(6,2),
        field: 'no_pressure_on_the_project',
        allowNull: true,
      },
      goodClientManagement: {
        type: Sequelize.DECIMAL(6,2),
        field: 'good_client_management',
        allowNull: true,
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('customer');
  },
};
