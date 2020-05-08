
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
      'MatterTypes',
      [
        {
          name: 'Litigation',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Corporate',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
  
      {},
    ),
    
    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('MatterTypes', null, {})
  };
  