'use strict';

module.exports = function defineTeam(sequelize, DataTypes) {
  const Team = sequelize.define(
    'team',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      rightSkillLevel: {
        type: DataTypes.DECIMAL(6,2),
        field: 'right_skill_level',
        allowNull: true,
      },
      teamMood: {
        type: DataTypes.DECIMAL(6,2),
        field: 'team_mood',
        allowNull: true,
      },
      busFactor: {
        type: DataTypes.DECIMAL(6,2),
        field: 'bus_factor',
        allowNull: true,
      },
      teamOkWithClientBusiness: {
        type: DataTypes.DECIMAL(6,2),
        field: 'team_ok_with_client_business',
        allowNull: true
      },
      teamOkWithProjectTechnology: {
        type: DataTypes.DECIMAL(6,2),
        field: 'team_ok_with_project_technology',
        allowNull: true,
      },
    },
    {
      tableName: 'team',
      timestamps: true,
    },
  );

  // eslint-disable-next-line no-unused-vars
  Team.associate = function associateTeam(models) {
    Team.hasMany(models.Ongoing, { foreignKey: 'teamId' });
  };

  return Team;
};
