'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Updates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      updatetype: {
        type: Sequelize.STRING
      },
      case: {
          type: Sequelize.TEXT
      },
      new_court_date: {
          type: Sequelize.DATE
      },
      staff_name: Sequelize.STRING,
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
    return queryInterface.dropTable('Updates');
  }
};