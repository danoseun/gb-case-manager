
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Clients',
    [
      {
        name: 'James Client',
        phone: '07033283421',
        email: 'jamesclient@gmail.com',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Peter Client',
        phone: '07033283424',
        email: 'pterclient@gmail.com',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Connor Client',
        phone: '07033283421',
        email: 'connorc@gmail.com',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bugzzy Client',
        phone: '07033823421',
        email: 'bugzy@gmail.com',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],

    {},
  ),
  
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Clients', null, {})
};
