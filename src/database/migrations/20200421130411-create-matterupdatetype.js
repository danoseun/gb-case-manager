'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MatterUpdateTypes', {
      matterId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Matters',
          key: 'id',
          as: 'matterId'
        }
      },
      updatetypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'UpdateTypes',
          key: 'id',
          as: 'updatetypeId'
        }
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
      return queryInterface.dropTable('MatterUpdateTypes');
    
  }
};
