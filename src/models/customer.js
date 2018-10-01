'use strict';

module.exports = function defineCustomer(sequelize, DataTypes) {
  const Customer = sequelize.define(
    'customer',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      clientOpenerForNew: {
        type: DataTypes.DECIMAL(6,2),
        field: 'client_opener_for_new',
        allowNull: true,
      },
      noPressureOnTheProject: {
        type: DataTypes.DECIMAL(6,2),
        field: 'no_pressure_on_the_project',
        allowNull: true,
      },
      goodClientManagement: {
        type: DataTypes.DECIMAL(6,2),
        field: 'good_client_management',
        allowNull: true,
      },
    },
    {
      tableName: 'customer',
      timestamps: true,
    },
  );

  // eslint-disable-next-line no-unused-vars
  Customer.associate = function associateCustomer(models) {
    Customer.hasMany(models.Ongoing, { foreignKey: 'customerId' });
  };

  return Customer;
};
