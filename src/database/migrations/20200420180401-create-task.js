'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      case: Sequelize.STRING,
      task_detail: {
        type: Sequelize.TEXT
      },
      due_date: {
        type: Sequelize.DATE
      },
      due_time: {
        type: Sequelize.STRING
      },
      assignee: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status:{
        type: Sequelize.ENUM,
        values: ['to-do','in-progress', 'completed']
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      matterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tasks');
  }
};