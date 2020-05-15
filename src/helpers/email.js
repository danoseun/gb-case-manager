import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const Transporter = async (msg, res) => {
  try {
    await sgMail.send(msg);
    return res.status(200).json({ message: 'Mail sent successfully' });
  } catch (err) {
    return res.status(500).json({ 'Error sending email': err });
  }
};

/**This email temaplate
 * is specifically for two-factor authentication
 * for admins
 */
export const emailTemplate = (email, code) => {
    const to = email;
    const from = 'oluwaseun@asb.ng';
    const subject = 'Login Verification Code';
    const html = `
    <p>Hey ${email}</p>
    <p>For extra security, a temporary verification code has been requested to confirm that it is you who is trying to login to the Ghalib Chamber Case Management Portal.</p>
    <p>Here is your verification code: ${code}</p>
    <p>If you don’t use this code within 20 minutes, it will expire.</p>
    <p>If you are not trying to login at this moment please ignore this email.</p>
    <p>Ghalib Chambers</p>
    `;
    return {
      from, to, subject, html
    };
  };

/**
 * Function that generates
 * token for password reset using
 * email and createdAt as arguments
 */
export const useUserDetailToMakeToken = (user) => {
  const token = jwt.sign({ user }, process.env.SECRETKEY);
  return token;
};

//`${req.protocol}://${req.headers.host}/password/reset/${token}`;
export const getPasswordResetURL = (req, token) => `https://ghalib-case-manager.herokuapp.com/password/reset/${token}`;

/**
 * This template is specifically for password
 * reset
 * 
 */

export const passwordResetEmailTemplate = (user, url) => {
  const to = user.email;
  const from = 'oluwaseun@asb.ng';
  const subject = 'Password Reset';
  const html = `
  <p>Hey ${user.fullname}</p>
  <p>We got a request that you forgot your password, If you really did, click the link below to reset password</p>
  <a href=${url}>${url}</a>
  <p>If you don’t use this link within 20 minutes, it will expire and you will have to request for another.</p>
  <p>Ghalib Chambers</p>
  `;
  return {
    from, to, subject, html
  };
};
  


//export const getPasswordResetURL = (token) => `http://localhost:1600/password/reset/${token}`;
  





