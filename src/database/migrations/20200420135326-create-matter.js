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
        type: Sequelize.TEXT
      },
      code: {
        type: Sequelize.TEXT
      },
      client: {
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.TEXT
      },
      matter_type: {
        type: Sequelize.TEXT
      },
      assignees: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
      },
      location: {
        type: Sequelize.STRING
      },
      branch: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('active', 'closed')
      },
      parties: {
        type: Sequelize.TEXT
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_by:{
        type: Sequelize.STRING
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