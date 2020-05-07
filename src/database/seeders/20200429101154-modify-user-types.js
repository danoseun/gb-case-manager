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
        email: 'justthinking54@gmail.com',
        password: hash,
        role: 'admin',
        branch: 'Lagos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: 'Johnson',
        lastname: 'Dwayne',
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
        email: 'seunad19@gmail.com',
        password: hash,
        role: 'staff',
        branch: 'Lagos',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],

    {},
  ),
  
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
