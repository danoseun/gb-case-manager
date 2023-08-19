module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Updates',
    [
      {
        title: 'title update',
        description: 'description',
        updatetype: 'updatetype',
        case: 'new title',
        new_court_date: null,
        staff_name: 'Jones Davies',
        userId: 2,
        matterId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'another title update',
        description: 'description here',
        updatetype: 'updatetype',
        case: 'new title two',
        new_court_date: null,
        staff_name: 'Jones Davies',
        userId: 2,
        matterId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'another title here',
        description: 'another description here again',
        updatetype: 'updatetype',
        case: 'new title two',
        new_court_date: null,
        staff_name: 'Quincy Apache',
        userId: 4,
        matterId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],

    {},
  ),
  
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Updates', null, {})
};

