import Validator from 'validatorjs';
import db from '../database/models';
import { findUserByEmail } from '../services/user'
import { comparePassword, generatePassword } from '../helpers/password';

/**
 * Validates user properties during creation
 */
export const userValidator = {
   async addUserValidator(req, res, next){
    let { fullname, email, password, branch } = req.body;

    const rules = {
        fullname: 'required|min:2',
        email: 'required|email|min:2',
        branch: 'required'
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()){
        return res.status(400).json({
            status: 400,
            error: validation.errors.errors
        })
    }

    try {
        const result  = await findUserByEmail(email);
        //console.log('res', result);
        if(result === null || result === undefined){
            //console.log('WAHALA', result);
            password = generatePassword();

            req.body.fullname = fullname;
            req.body.email = email;
            req.body.password = password;
            req.body.branch = branch;
            return next();
        }
        //console.log('PROBLEM', result);
        if(result.dataValues.email === email){
            return res.status(409).json({
                status: 409,
                error: 'Email already exists'
            })
        } 
    } catch(error){
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
},

async loginUserValidator(req, res, next){
    const { email, password } = req.body;
    const rules = {
        email: 'required|email|min:2',
        password: 'required'
    };
    const validation = new Validator(req.body, rules);
    if (validation.fails()){
        return res.status(400).json({
            status: 400,
            error: validation.errors.errors
        })
    }

    let data;
    try {
        const result  = await findUserByEmail(email);
        if(result === undefined || result === null){
            return res.status(404).json({
                status: 404,
                error: 'Unknown email, please check email and try again'
            })
        }
        const compare = comparePassword(password, result.dataValues.password);
        if(!compare){
            return res.status(401).json({
                status: 401,
                error: 'Authentication failed'
            });
        }
        
        data = result.dataValues;
    } catch(error){
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
    req.body = data;
    return next();
  }
}