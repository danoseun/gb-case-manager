module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
      'Tasks',
      [
        {
          task_detail: 'detail one',
          case: 'matter title',
          due_date: '2020-06-24',
          assignee: 3,
          status: 'to-do',
          userId: 2,
          matterId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          task_detail: 'detail two',
          case: 'matter title',
          due_date: '2020-06-26',
          assignee: 4,
          status: 'to-do',
          userId: 2,
          matterId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          task_detail: 'detail three',
          case: 'matter title',
          due_date: '2020-06-17',
          assignee: 3,
          status: 'completed',
          userId: 2,
          matterId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          task_detail: 'detail four',
          case: 'matter title',
          due_date: '2020-06-17',
          assignee: 3,
          status: 'completed',
          userId: 2,
          matterId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
  
      {},
    ),
    
    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Tasks', null, {})
  };
  
  