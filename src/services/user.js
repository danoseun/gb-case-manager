import model from '../database/models'
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 *This function will get a user by email address...
 *@param {String} email - the user's email
 *@return {Promise} - response of sequelize
 */
export const findUserByEmail = (email) =>  model.User.findOne({ where: { email } });




export const Transporter = async (msg, res) => {
  try {
    await sgMail.send(msg);
    return res.status(200).json({ message: 'Mail sent successfully' });
  } catch (err) {
    return res.status(500).json({ 'Error sending email': err });
  }
};

export const registerEmailTemplate = (adminName, userObject, loginurl) => {
    const to = userObject.email;
    const from = 'oluwaseun@asb.ng';
    const subject = 'Invitation to Join Ghalib Chambers Platform';
    const html = `
    <p>${adminName} has invited you to join the Ghalib Chambers Case Management Portal as a staff.</p>
    <p>Here are your login details, email:${userObject.email} and password:${userObject.password}</p>
    <p>Login at <a href=${loginurl}>${loginurl}</a> with the above details after which we strongly recommend you change you password afterwards</p>
    <p>Ghalib Chambers.</p>
    `;
    return {
      from, to, subject, html
    };
  };

  /**
 * Helper function to update a user password
 * @param {String} hash  - user's password
 *  @param {String} email  - user's email
 * @returns {Promise} - sequelize response
 */
export const updatePassword = async (password,hash, email) => {
    try {
      const res = await model.User.update({password:hash}, {returning: true, where: { email } });
      return res;
    } catch (err) {
      throw err;
    }
  };

  // /**Get all users
  //  * on the platform
  //  */
  // export const getAllUsers = async ()  => {
  //   try {
  //     return await model.User.findAll();
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  /** get single user on 
   * the application
   */
  export const getUser = async (email) => {
    try {
        const User = model.User.findOne({ where: { email } });
        return User;
      } catch (error) {
        throw error;
      }
  }

  


  

  





