'use strict';
import 'dotenv/config';
import { hashPassword } from '../../helpers/password';

const hash = hashPassword(process.env.PASSWORD);

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Users',
    [
      {
        fullname: 'James Faker',
        email: 'asbengdev@gmail.com',
        password: hash,
        is_admin: true,
        branch: 'Lagos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: 'Faker Jones',
        email: 'justthinking54@gmail.com',
        password: hash,
        is_admin: true,
        branch: 'Lagos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: 'jdoe',
        email: 'olubajidavid@gmail.com',
        password: hash,
        is_admin: false,
        branch: 'Lagos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: 'jdoe',
        email: 'seunad19@gmail.com',
        password: hash,
        is_admin: false,
        branch: 'Lagos',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],

    {},
  ),
  
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
