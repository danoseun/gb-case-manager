/* eslint-disable max-len */
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
const rounds = Number(process.env.ROUNDS);

/**
       * Hash Password Method
       * @param {string} password
       * @returns {string} returns hashed password
       */
export const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(rounds));

/**
       * compare Password
       * @param {string} password
       * @param {string} hashedPassword
       * @returns {Boolean} return true or false
       */
export const comparePassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

/**
 * This function
 * ensures that password contains 
 * minimum of 8 characters
 * and at least one number
 */
export const checkPassword = password => {
       password = password.trim();
       const reg = /\d/.test(password);
       if(!reg || password.length < 8){
           return false
       } else {
           return true;
       }
     }

/**
 * Function to generate random password
 * with 8 characters 
 * password will have at least a number
 * an alphabet.
 * 
 */
export const generatePassword = (length = 8, chars) => {
       chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
       let result = '';
       for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
       return result;
   }
