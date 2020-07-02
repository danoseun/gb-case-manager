import 'dotenv/config';
import model from '../database/models'
import { Op } from 'sequelize';
import { comparePassword, hashPassword, checkPassword } from '../helpers/password';
import { findUserByEmail, registerEmailTemplate, 
        updatePassword, getUser, getUserById } from '../services/user'
import { emailTemplate, Transporter, getPasswordResetURL, 
        passwordResetEmailTemplate, 
        useUserDetailToMakeToken } from '../helpers/email';
import { convertParamToNumber } from '../helpers/util'; 
import { createToken } from '../middleware/auth';
import { redisClient } from '../index'
import jwt from 'jsonwebtoken';

import cryptoRandomString from 'crypto-random-string';



/**
 * User creation object
 */
export const userController = {
    /**
     * This functionality allows admin to add 
     * users to the platform
     * 
     */
   async addUser(req, res){ 
    try {
    let { email, password } = req.body;
    const userObject = {email, password};
    
    let hash = hashPassword(password);
    req.body.password = hash;
    
    let clonedObject = Object.assign({}, req.body); 
    
    delete clonedObject.adminfullname;
    let user = await model.User.create(clonedObject);

    const adminName = req.body.adminfullname;

    
    const loginurl = `https://ghalib-case-manager.herokuapp.com/login`;
    
    const emailSent = registerEmailTemplate(adminName, userObject, loginurl);
    Transporter(emailSent, res);
    } catch(error){
        return res.status(500).json({
            status: 500,
            error: error
        });
    }
},

  
/**
  * This function allows all types of users 
  * to login on the platform
*/
  async loginUser(req, res){
      const { role, email } = req.body
    try {
        if(role === 'admin'){
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
            error: error
        });
    }
  },
  

  /**
   * This function verifies code sent to admin
   * and creates token afterwards
   * Code expires after 20mins
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
 * pagination and search inclusive.
 */
async adminGetAllUsers(req, res) {
    let { offset, limit, order, sort, ...rest } = req.query;
    offset = offset ? parseInt(offset) : 0;
    limit = limit ? parseInt(limit) : 10;
    let options = {};

    if (Object.keys(rest).length) {
        for (const key in rest) {
          if (rest.hasOwnProperty(key)) {
            const value =
              key === "q" ? { [Op.iLike]: `%${rest[key]}%` } : rest[key];
            const field = key === "q" ? "fullname" : key;
            options[field] = value;
          }
        }
      }

    try {
        const data = await model.User.findAndCountAll({
            where: options,
            attributes: { exclude: ['password'] },
            order: [[sort || "updatedAt", order || "DESC"]],
            offset,
            limit
          });
            if(data.rows.length > 0){
            return res
            .status(200)
            .json({ data: data.rows, offset, limit, total: data.count });
         }
           else {
              return res.status(404).json({
                  status: 404,
                  message: 'What you are searching for is unavailable at this time'
              })
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
   * staff can also update their profile 
   * 
   */
  async updateUserProfile(req, res){
    let id = convertParamToNumber(req.params.id);
      try {
          const user = await getUserById(id)
          // admins can edit all users' profile while the staff can edit their own profile
          if(req.authData.payload.role === 'admin' || (req.authData.payload.id === user.id)) {
            if(!user){
                return res.status(404).json({
                    status: 404,
                    error: 'This user does not exist'
                });
            }
            else {
                user.role = req.body.role || user.role;
                user.firstname = req.body.firstname ? req.body.firstname.trim() : user.firstname;
                user.lastname = req.body.lastname ? req.body.lastname.trim() : user.lastname;
                user.fullname = `${user.firstname} ${user.lastname}`
                user.branch = req.body.branch || user.branch;
                const val = await user.save();
  
                return res.status(200).json({
                    status: 200,
                    val,
                    message: 'profile change successful'
                })
            }
          }
          return res.status(403).json({
              status:403,
              error: 'You are not authorized to carry out this action'
          });
          
      }
      catch(error){
          return res.status(500).json({
              status: 500,
              err: error
          });
      }
  },
  
  /** 
   * admin can delete users 
   */
  async adminDeleteUser(req, res){
      let id = convertParamToNumber(req.params.id);
      try {
          const user = await getUserById(id);
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
  },

  /**
   * Change password available on profile settings 
   */  
  async changePasswordProfile(req, res){

     let { password, newPassword, confirmNewPassword } = req.body;

     try {
        const user = await getUser(req.authData.payload.email);
        let compare = comparePassword(password, user.password);
        if(!compare) {
            return res.status(400).json({
                status: 400,
                error: 'Ensure that you are entering your old password'
            })
        }

        if(password.trim() === newPassword.trim()){
            return res.status(400).json({
                status: 400,
                error: 'Your old and new password can not be the same'
            });
        }

        if(newPassword.trim() !== confirmNewPassword.trim() || newPassword.trim() === ''){
            return res.status(400).json({
                status: 400,
                error: 'Ensure the new password fields match and that they are not empty'
            })
        }

        if(!checkPassword(newPassword)) {
            return res.status(400).json({
                status: 400,
                message: 'Ensure that the new password has 8 characters and contains a number at least'
            });
        }

        let hash = hashPassword(newPassword);
        await updatePassword(password,hash, req.authData.payload.email);
                
        return res.status(202).json({
            status: 202,
            message: 'Password updated successfully on profile settings'
        });

     } catch(error){
         return res.status(500).json({
             status: 500,
             error: error.message
         });
     }
     
  }
}




  

