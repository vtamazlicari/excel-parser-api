'use strict';

module.exports = function definePractices(sequelize, DataTypes) {
  const Practices = sequelize.define(
    'practices',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      CL: {
        type: DataTypes.DECIMAL(6,2),
        field: 'cl',
        allowNull: true,
      },
      techDebt: {
        type: DataTypes.DECIMAL(6,2),
        field: 'teach_debt',
        allowNull: true,
      },
      TDinSteer: {
        type: DataTypes.DECIMAL(6,2),
        field: 'td_in_steer',
        allowNull: true,
      },
      codeReview: {
        type: DataTypes.DECIMAL(6,2),
        field: 'code_review',
        allowNull: true
      },
      codingRules: {
        type: DataTypes.DECIMAL(6,2),
        field: 'coding_rules',
        allowNull: true,
      },
      testingProcessInPlace: {
        type: DataTypes.DECIMAL(6,2),
        field: 'testing_process_in_place',
        allowNull: true,
      },
      refactoringPlanned: {
        type: DataTypes.DECIMAL(6,2),
        field: 'refactoring_planned',
        allowNull: true,
      },
    },
    {
      tableName: 'practices',
      timestamps: true,
    },
  );

  // eslint-disable-next-line no-unused-vars
  Practices.associate = function associatePractices(models) {
    Practices.hasMany(models.Ongoing, { foreignKey: 'practicesId' });
  };

  return Practices;
};
