'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    task_detail: {
      type:DataTypes.TEXT
    },
    due_date: DataTypes.DATE,
    due_time: DataTypes.STRING,
    assignees: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allownull: true,
      defaultValue: []
    },
    status:{
      type: DataTypes.ENUM('to-do','in-progress', 'completed')
    },
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