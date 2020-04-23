import 'dotenv/config';
import model from '../database/models'
import { comparePassword, hashPassword, checkPassword } from '../helpers/password';
import { findUserByEmail, registerEmailTemplate, 
        updatePassword, getAllUsers, getUser } from '../services/user'
import { emailTemplate, Transporter, getPasswordResetURL, 
        passwordResetEmailTemplate, 
        useUserDetailToMakeToken } from '../helpers/email';
import { createToken } from '../middleware/auth';
import { redisClient } from '../index'
import jwt from 'jsonwebtoken';

import cryptoRandomString from 'crypto-random-string';



/**
 * Validates user properties during creation
 */
export const userContoller = {
    /**
     * This function add users to the platform
     * 
     */
   async addUser(req, res){   
try {
    let { fullname, email, password, branch } = req.body;
    const userObject = {email, password};
    
    let hash = hashPassword(password);
    req.body.password = hash;
    
    var clonedObject = Object.assign({}, req.body);
    
    delete clonedObject.adminfullname;
    let user = await model.User.create(clonedObject);

    const adminName = req.body.adminfullname;

    const loginurl = `${req.protocol}://${req.headers.host}/login`;
    
    const emailSent = registerEmailTemplate(adminName, userObject, loginurl);
    Transporter(emailSent, res);
    // return res.status(200).json({
    //     status: 201,
    //     message: 'User successfully created'
    // });
    } catch(error){
        console.log('err', error);
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
},

async loginUser(req, res){
    try {
    const token = createToken(req.body);
            return res.status(200).json({
                status: 200,
                token
            })
    
        
    } catch(error){
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
  },

  async loginAdmin(req, res){
      const { is_admin, email } = req.body;
    try {
        if(is_admin){
            const code = cryptoRandomString({length: 6, type: 'distinguishable'});
            const emailSent = emailTemplate(email, code);
            Transporter(emailSent, res);
            redisClient.set(email, code, 'EX', 1200);
        } else {
            return res.status(403).json({
                status: 403,
                error: 'You are not authorized'
            });
        }
        
    } catch(error){
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
  },
  
  async adminVerification(req, res){
      const { email, code } = req.body;
     let token;
     let data  = await findUserByEmail(email);
      redisClient.get(email, (err, result) => {
        if (err) {
          return res.status(500).json({
              error: err.message
          });
        }
        //if match is found
        if (result !== null) {
            if(code === result) {
                token = createToken(data.dataValues);
                return res.status(200).json({
                    status: 200,
                    token
                });
            } else {
                return res.status(400).json({
                    status: 400,
                    error: 'Seems you entered the wrong code'
                });
            }
        } else {
            return res.status(400).json({
                status: 400,
                message: 'Sorry, this code has expired'
            });
        }
      });
  },

  /** Set and get reset password link in redis for 20mins */
  async resetPassword(req, res){
    let user = await findUserByEmail(req.body.email);

    try {
        if(user === null || user === undefined){
            return res.status(404).json({
                status: 404,
                message: `Unknown email, please check email and try again`
            });
        }
        const token = useUserDetailToMakeToken(user);
        const url = getPasswordResetURL(req, token);
        const emailSent = passwordResetEmailTemplate(user, url);
        Transporter(emailSent, res);
        redisClient.set(user.email, url, 'EX', 1200);
    }
    catch(err){
        return res.status(500).json({
            status: 500,
            err
        })
    }
},

/**Get reset link from redis
 * set uri dynamically
 * */
async receiveNewPassword(req, res){
    const { token } = req.params;
    const { password, confirmpassword } = req.body;
    if((password.trim() !== confirmpassword.trim()) || (password.trim()&&confirmpassword.trim() === '')) {
        return res.status(400).json({
            status: 400,
            error: 'Ensure both password fields match'
        });
    }

    if(!checkPassword(password)) {
        return res.status(400).json({
            status: 400,
            message: 'Ensure password has 8 characters and contains a number at least'
        });
    }

    else {
        try {
            const payload = jwt.verify(token, process.env.SECRETKEY);
                let hash = hashPassword(password);

                await updatePassword(password,hash, payload.user.email);
                
                return res.status(202).json({
                    status: 202,
                    message: 'Password updated successfully'
                });
        } catch(err){
            return res.status(500).json({
                status: 500,
                err: err.message
            });
        }
    }
},

async adminGetAllUsers(req, res) {
    try {
      const allUsers = await getAllUsers();
      if (allUsers.length > 0) {
        return res.status(200).json({
            status: 200,
            allUsers
        })
      } else {
        return res.status(200).json({
            status: 200,
            message: 'No users currently on the platform'
        });
      }
    } catch (error) {
      return res.status(500).json({
          status: 500,
          err: error.message
      });
    }
  },

  async adminChangeUserRole(req, res){
    if (!req.body.email || req.body.email.trim() === ''){
        return res.status(400).json({
            status: 400,
            error: 'Enter user email before role can be changed'
        });
    }
    let { email } = req.body;
    email = email.trim();
      try {
          const user = await getUser(email)
          if(!user){
              return res.status(404).json({
                  status: 400,
                  error: 'Unknown email, please check email and try again later'
              });
          }
          else{
              user.is_admin = !user.is_admin;
              const val = await user.save();

              return res.status(200).json({
                  status: 200,
                  val,
                  message: 'role change successful'
              })
          }
      }
      catch(error){
          return res.status(500).json({
              status: 500,
              err: error.message
          });
      }
  },

  async adminDeleteUser(req, res){
      if (!req.body.email || req.body.email.trim() === ''){
          return res.status(400).json({
              status: 400,
              error: 'Enter user email to be deleted'
          });
      }
      let { email } = req.body;
      email = email.trim();
      try {
          const user = await getUser(email);
          if(user) {
                await user.destroy();
                return res.status(200).json({
                    status: 200,
                    message: 'User successfully deleted'
                });
          } else {
              return res.status(404).json({
                  status: 404,
                  message: 'User not found'
              });
          }
      }
      catch(error){
          return res.status(500).json({
              status: 500,
              err: error.message
          });
      }
  }


//   usePass(req, res){
//       const { email } = req.body;
//       const hash = hashPassword(email);

//       const compare = comparePassword(email, hash);
//       console.log('COMPARE', compare);
//   },

//   useToken(req){
//       const { email } = req.body;
//       const token = jwt.sign({ email }, 'SECRET');

//       const verify = jwt.verify(token, 'SECRET');
//       console.log('VERIFY', verify);
//       if(verify.email === email){
//           console.log('Oops');
//       }
//   }
}

/**
 * for admin invite
 * store admin filled form in
 * redis then...
 */