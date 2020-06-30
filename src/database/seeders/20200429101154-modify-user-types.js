'use strict';
import 'dotenv/config';
import { hashPassword } from '../../helpers/password';

const hash = hashPassword(process.env.PASSWORD);

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Users',
    [
      {
        firstname: 'James',
        lastname: 'Faker',
        fullname: 'James Faker',
        email: 'asbengdev@gmail.com',
        password: hash,
        role: 'admin',
        phone: '07033283421',
        branch: 'Lagos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: 'Jones',
        lastname: 'Davies',
        fullname: 'Jones Davies',
        email: 'damienlee43@gmail.com',
        password: hash,
        role: 'admin',
        branch: 'Lagos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: 'Johnson',
        lastname: 'Dwayne',
        fullname: 'Johnson Dwayne',
        email: 'olubajidavid@gmail.com',
        password: hash,
        role: 'staff',
        branch: 'Lagos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: 'Quincy',
        lastname: 'Apache',
        fullname: 'Quincy Apache',
        email: 'quincyapache@yahoo.com',
        password: hash,
        role: 'staff',
        branch: 'Lagos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: 'Sanni',
        lastname: 'Dans',
        fullname: 'Sanni Dans',
        email: 'hid19@gmail.com',
        password: hash,
        role: 'staff',
        branch: 'Lagos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
 
    ],

    {},
  ),
  
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
