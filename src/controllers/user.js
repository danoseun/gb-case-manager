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
     * This functionality allows admin to add 
     * users to the platform
     * 
     */
   async addUser(req, res){   
    try {
    let { fullname, email, password, branch, is_admin } = req.body;
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

// async loginUser(req, res){
//     try {
//     const token = createToken(req.body);
//             return res.status(200).json({
//                 status: 200,
//                 token
//             })
    
        
//     } catch(error){
//         return res.status(500).json({
//             status: 500,
//             error: error.message
//         });
//     }
//   },

  
/**
  * This function allows all types of users 
  * to login the platform
*/
  async loginUser(req, res){
      const { is_admin, email } = req.body
    try {
        if(is_admin){
            const code = cryptoRandomString({length: 6, type: 'distinguishable'});
            const emailSent = emailTemplate(email, code);
            Transporter(emailSent, res);
            redisClient.set(code, email, 'EX', 1200);
            return;
        }
        const userdetail = req.body;
        delete userdetail.password;
        const token = createToken(req.body);
            return res.status(200).json({
                status: 200,
                token,
                userdetail
            }) 
        
    } catch(error){
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
  },
  

  /**
   * This function verifies code sent to admin
   * code expires after 20mins
   */
  async adminVerification(req, res){
      const { code } = req.body;
     let token;

      redisClient.get(code, async(err, email) => {
        if (err) {
          return res.status(500).json({
              error: err.message
          });
        }
        //if match is found
        if (code !== null) {
            if(email !== null) {
                let data  = await findUserByEmail(email);
                delete data.dataValues.password;
                const userdetail = data.dataValues;
                token = createToken(data.dataValues);
                return res.status(200).json({
                    status: 200,
                    token,
                    userdetail
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

  /** 
   * Sends password reset link to users
   * URL expires after 20mins
   */
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

/**
 * receives new password
 * and sets it in the database
 * 
 */
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
        const payload = jwt.verify(token, process.env.SECRETKEY);
        try {
            redisClient.get(payload.user.email, async(err, result) => {
                if(err){
                    return res.status(500).json({
                        error: err.message
                    });
                }
                if(result !== null){
                    let hash = hashPassword(password);

                    await updatePassword(password,hash, payload.user.email);
                
                    return res.status(202).json({
                        status: 202,
                        message: 'Password updated successfully'
                    });
                }
                else {
                    return res.status(404).json({
                        status: 404,
                        message: 'The password reset link has expired, request another'
                    })
                }
            })
                
        } catch(err){
            return res.status(500).json({
                status: 500,
                err: err.message
            });
        }
    }
},

/**
 * admin can fetch all users
 */
async adminGetAllUsers(req, res) {
    try {
      const allUsers = await getAllUsers();
        
      if (allUsers.length > 0) {
          for (let i = 0; i < allUsers.length; i++)  {
            delete allUsers[i].dataValues.password;
          }
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

  /**
   * admins can update user profile 
   * 
   */
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
          else {
              user.is_admin = req.body.is_admin || user.is_admin;
              user.fullname = req.body.fullname || user.fullname;
              user.branch = req.body.branch || user.branch;
              const val = await user.save();

              return res.status(200).json({
                  status: 200,
                  val,
                  message: 'profile change successful'
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
  
  /** 
   * admin can delete users 
   */
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
}


