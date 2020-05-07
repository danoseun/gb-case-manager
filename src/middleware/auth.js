/* eslint-disable prefer-destructuring */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

export const createToken = (payload) => {
  const token = jwt.sign({ payload }, process.env.SECRETKEY);
  return `Bearer ${token}`;
};

/**
 * This function verifies
 * that user token is valid
 * */
export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({
      status: 403,
      error: 'No token supplied'
    });
  }
  token = token.split(' ')[1];
     
    jwt.verify(token, process.env.SECRETKEY, (error, authData) => {

      if (error) {
        if (error.message.includes('signature')) {
          return res.status(403).json({
            status: 403,
            error: 'Invalid token supplied'
          });
        }
        return res.status(403).json({
          status: 403,
          error: error.message
        });
      }
      req.authData = authData;
      return next();
    }); 
};

/**
 * this function
 * verifies user is an admin
 *  
 */
export const verifyAdmin = (req, res, next) => {
  const { role } = req.authData.payload;
  if (role === 'admin') {
    req.body.adminfullname = `${req.authData.payload.firstname} ${req.authData.payload.lastname}`;
    return next();
  }

  return res.status(401).json({
    status: 401,
    error: 'You do not have permissions to access this route'
  });
};
