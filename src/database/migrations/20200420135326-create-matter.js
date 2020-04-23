'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Matters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      code: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      contact_person: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      start_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      type: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      assigned_lawyers: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      assignee: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      parties: {
        type: Sequelize.TEXT
      },
      resources: {
        type: Sequelize.TEXT
      },
      court_date: {
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mattertypeId: {
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
    return queryInterface.dropTable('Matters');
  }
};