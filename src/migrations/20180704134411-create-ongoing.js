'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('ongoing', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      teamId: {
        type: Sequelize.INTEGER,
        field: 'team_id',
        foreignKey: true,
        references: {
          model: 'team',
          key: 'id',
        },
        allowNull: true,
      },
      customerId: {
        type: Sequelize.INTEGER,
        field: 'customer_id',
        foreignKey: true,
        references: {
          model: 'customer',
          key: 'id',
        },
        allowNull: true,
      },
      practicesId: {
        type: Sequelize.INTEGER,
        field: 'practices_id',
        foreignKey: true,
        references: {
          model: 'practices',
          key: 'id',
        },
        allowNull: true,
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
    return queryInterface.dropTable('ongoing');
  },
};
