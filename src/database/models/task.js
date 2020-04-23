'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    task_detail: {
      type:DataTypes.TEXT
    },
    case: DataTypes.TEXT,
    due_date: DataTypes.DATE,
    due_time: DataTypes.STRING,
    assignee: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    matterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    })

    Task.belongsTo(models.Matter, {
      foreignKey: 'matterId',
      as: 'matter',
      onDelete: 'CASCADE',
    })
  };
  return Task;
};