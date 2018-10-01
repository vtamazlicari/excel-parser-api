'use strict';

module.exports = function defineOngoing(sequelize, DataTypes) {
  const Ongoing = sequelize.define(
    'ongoing',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      teamId: {
        type: DataTypes.INTEGER,
        field: 'team_id',
        allowNull: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        field: 'customer_id',
        allowNull: true,
      },
      practicesId: {
        type: DataTypes.INTEGER,
        field: 'practices_id',
        allowNull: true,
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
      tableName: 'ongoing',
      timestamps: true,
    },
  );

  // eslint-disable-next-line no-unused-vars
  Ongoing.associate = function associateOngoing(models) {
    Ongoing.hasMany(models.Projects, { foreignKey: 'ongoingId' });
    Ongoing.belongsTo(models.Team, {foreignKey: 'teamId'});
    Ongoing.belongsTo(models.Customer, {foreignKey: 'customerId'});
    Ongoing.belongsTo(models.Practices, {foreignKey: 'practicesId'});
  };

  return Ongoing;
};
