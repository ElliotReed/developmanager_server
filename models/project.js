"use strict";

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "project",
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
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      archive: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
    },
    { timestamps: true, tableName: "project" }
  );

  Project.associate = function (models) {
    Project.belongsTo(models.user);
  };

  // Project.sync({ alter: true });
  return Project;
};
