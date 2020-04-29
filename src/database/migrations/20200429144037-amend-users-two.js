'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return Promise.all([queryInterface.removeColumn(
    'Users',
    'is_admin',
    Sequelize.BOOLEAN
   ),
   queryInterface.addColumn(
     'Users',
     'role',{
       type: Sequelize.ENUM('admin', 'staff'),
       defaultValue: 'staff'
     }
   )
   ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return Promise.all([
     queryInterface.removeColumn(
    'Users',
    'is_admin',
    Sequelize.BOOLEAN
   ),
   queryInterface.addColumn(
     'Users',
     'role',{
       type: Sequelize.ENUM('admin', 'staff'),
       defaultValue: 'staff'
     }
   ),
   queryInterface.dropTable('Users')
   ])
  }
};