"use strict";

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "task",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      task: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      completedDate: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
      recurrence: {
        allowNull: true,
        type: DataTypes.DATEONLY,
      },
    },
    { timestamps: true, tableName: "task" }
  );

  Task.associate = function (models) {};

  return Task;
};
